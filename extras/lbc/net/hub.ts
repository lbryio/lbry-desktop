// Vendored from bitcoinbrisbane/lBC-wallet-with-mining-ability (MIT), packages/core/src/net/hub.ts @ 93e19c1.
// Keep verbatim so it can be refreshed from upstream; bridge-specific code lives outside lib/lbc.

import { Emitter, chunk, mapLimit, sleep } from '../util/emitter.js';
import { LineRpcClient, RpcError } from './line-rpc.js';
import type { LineTransportFactory, SocketEndpoint } from './transport.js';
import type { BackendEvents, BackendStatus, ChainBackend, ChainTip, FetchedTransaction, HistoryItem } from './backend.js';
import { HEADER_SIZE, checkProofOfWork, parseHeader } from '../crypto/pow.js';
import type { NetworkParams } from '../networks.js';

export interface HubBackendOptions {
  servers: SocketEndpoint[];
  transportFactory: LineTransportFactory;
  network: NetworkParams;
  clientName: string;
  /** Protocol version announced to the hub (LBRY hubs accept 0.54–0.199). */
  protocolVersion?: string;
  requestTimeoutMs?: number;
  connectTimeoutMs?: number;
  log?: (level: 'info' | 'warn' | 'error', message: string) => void;
}

/** A connected, handshaken hub that is not (yet) the current server. */
interface HubSession {
  endpoint: SocketEndpoint;
  client: LineRpcClient;
  tip: ChainTip;
  latencyMs: number;
  serverVersion: string;
}

const SUBSCRIBE_BATCH = 100;
const TX_BATCH = 100;

/**
 * Client for LBRY hubs (lbryio/hub "herald" in Python and herald.go), which
 * speak an Electrum-derived JSON-RPC protocol over TCP.
 *
 * Compatibility notes derived from both server implementations:
 *  - address methods take base58 addresses (`blockchain.address.*`);
 *  - `blockchain.transaction.get` is unreliable on herald.go, so transactions
 *    are fetched with `blockchain.transaction.get_batch` (≤100 per call);
 *  - empty address status is `null` (Python) or `""` (Go).
 */
export class HubBackend extends Emitter<BackendEvents> implements ChainBackend {
  readonly kind = 'hub' as const;
  readonly untrusted = true;
  private client: LineRpcClient | null = null;
  private current: SocketEndpoint | null = null;
  private stopped = true;
  private connecting: Promise<void> | null = null;
  private status: BackendStatus = { connected: false, kind: 'hub' };
  private tip: ChainTip | null = null;
  private subscribed = new Set<string>();
  private keepalive: ReturnType<typeof setInterval> | null = null;
  private serverIndex = 0;
  private batchSupported = true;
  private hadConnection = false;
  /** Local time the current hub last announced a block (or we connected). */
  private lastTipAt = 0;

  constructor(private readonly options: HubBackendOptions) {
    super();
    if (options.servers.length === 0) throw new Error('no hub servers configured');
  }

  private log(level: 'info' | 'warn' | 'error', message: string) {
    this.options.log?.(level, message);
  }

  getStatus(): BackendStatus {
    return { ...this.status };
  }

  private setStatus(patch: Partial<BackendStatus>) {
    this.status = { ...this.status, ...patch };
    this.emit('status', this.getStatus());
  }

  async start(): Promise<void> {
    this.stopped = false;
    await this.ensureConnected();
  }

  async stop(): Promise<void> {
    this.stopped = true;
    if (this.keepalive) clearInterval(this.keepalive);
    this.keepalive = null;
    this.client?.close();
    this.client = null;
    this.setStatus({ connected: false });
  }

  private ensureConnected(): Promise<void> {
    if (this.client && !this.client.isClosed) return Promise.resolve();
    if (!this.connecting) {
      this.connecting = this.connectLoop().finally(() => {
        this.connecting = null;
      });
    }
    return this.connecting;
  }

  /**
   * Tries servers round-robin with backoff until one works (or the backend is stopped).
   * On networks with a steady block rate, a hub whose newest block is old is probably stuck
   * and would show a stale wallet, so an up-to-date hub is preferred. After a full round
   * without one, the most advanced of the stale hubs is used: the chain may really be slow,
   * or the device clock may be wrong.
   */
  private async connectLoop(): Promise<void> {
    let attempt = 0;
    let fallback: HubSession | null = null;
    try {
      while (!this.stopped) {
        const servers = this.options.servers;
        const endpoint = servers[this.serverIndex % servers.length]!;
        try {
          const session = await this.open(endpoint);
          if (this.stopped) {
            session.client.close();
            break;
          }
          const age = this.staleAge(session.tip);
          if (age === null || servers.length === 1) {
            this.adopt(session);
            return;
          }
          this.log('warn', `hub ${endpoint.host}:${endpoint.port} is behind: its newest block #${session.tip.height} is ${Math.round(age / 60)} min old; trying another hub`);
          if (!fallback || session.tip.height > fallback.tip.height) {
            fallback?.client.close();
            fallback = session;
          } else {
            session.client.close();
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          this.log('warn', `hub ${endpoint.host}:${endpoint.port} failed: ${msg}`);
          this.setStatus({ connected: false, error: `${endpoint.host}: ${msg}` });
        }
        this.serverIndex++;
        attempt++;
        if (attempt % servers.length === 0) {
          const best: HubSession | null = fallback;
          fallback = null;
          if (best && !best.client.isClosed && !this.stopped) {
            this.log('warn', `no up-to-date hub found; using ${best.endpoint.host}:${best.endpoint.port} at height ${best.tip.height}`);
            this.adopt(best);
            return;
          }
          best?.client.close();
          const delay = Math.min(30_000, 2_000 * 2 ** Math.min(4, Math.floor(attempt / servers.length) - 1));
          await sleep(delay);
        }
      }
    } finally {
      fallback?.client.close();
    }
    throw new Error('hub backend stopped');
  }

  /** Connects and handshakes, without making the server the current one yet. */
  private async open(endpoint: SocketEndpoint): Promise<HubSession> {
    const transport = this.options.transportFactory(endpoint);
    const client = new LineRpcClient(transport, { jsonrpc2: true, defaultTimeoutMs: this.options.requestTimeoutMs ?? 30_000 });
    const started = Date.now();
    try {
      await withTimeout(client.connect(), this.options.connectTimeoutMs ?? 8_000, 'connect timeout');
      const version = await client.request<[string, string]>('server.version', [this.options.clientName, this.options.protocolVersion ?? '0.113.0'], 8_000);
      const latencyMs = Date.now() - started;
      const tipRaw = await client.request<{ hex: string; height: number }>('blockchain.headers.subscribe', [true], 10_000);
      const tip = normalizeTip(tipRaw);
      this.checkNetwork(tip);
      return { endpoint, client, tip, latencyMs, serverVersion: Array.isArray(version) ? String(version[0]) : String(version) };
    } catch (err) {
      client.close();
      throw err;
    }
  }

  /** Makes an opened session the current connection. */
  private adopt(session: HubSession): void {
    const { endpoint, client, tip } = session;
    client.onNotification((method, params) => this.handleNotification(method, params));
    client.onClose(() => this.handleClose(client));
    this.client = client;
    this.current = endpoint;
    this.tip = tip;
    this.lastTipAt = Date.now();
    this.batchSupported = true;
    const wasReconnect = this.hadConnection;
    this.hadConnection = true;
    this.subscribed.clear();
    this.setStatus({
      connected: true,
      server: `${endpoint.host}:${endpoint.port}`,
      serverVersion: session.serverVersion,
      latencyMs: session.latencyMs,
      height: tip.height,
      error: undefined,
    });
    this.startKeepalive(client);
    this.log('info', `connected to hub ${endpoint.host}:${endpoint.port} at height ${tip.height}`);
    this.emit('tip', tip);
    if (wasReconnect) this.emit('reconnected', undefined);
  }

  /** Seconds since the tip's block was made, if that is suspiciously long ago; otherwise null. */
  private staleAge(tip: ChainTip): number | null {
    const limit = this.options.network.staleTipSeconds;
    if (!limit) return null;
    const age = Date.now() / 1000 - parseHeader(hexToBytesSafe(tip.header)).timestamp;
    return age > limit ? age : null;
  }

  /** A hub's tip must be an LBRY header with valid proof of work; anything else is a broken or lying hub. */
  private checkNetwork(tip: ChainTip) {
    if (tip.header.length !== HEADER_SIZE * 2) throw new Error('server returned a non-LBRY header');
    if (!checkProofOfWork(hexToBytesSafe(tip.header), this.options.network.powLimit)) throw new Error('server returned a block header with invalid proof of work');
  }

  private startKeepalive(client: LineRpcClient) {
    if (this.keepalive) clearInterval(this.keepalive);
    this.keepalive = setInterval(() => {
      if (client.isClosed) return;
      if (Date.now() - Math.max(client.lastReceived, client.lastSent) > 50_000) {
        client.request('server.ping', [], 10_000).catch(() => client.close());
      }
      // A hub that stops announcing blocks is probably stuck: move on to another one.
      const limit = this.options.network.staleTipSeconds;
      if (limit && this.options.servers.length > 1 && Date.now() - this.lastTipAt > limit * 1000) {
        this.log('warn', `no new block from ${this.current?.host} for ${Math.round(limit / 60)} min; trying another hub`);
        client.close();
      }
    }, 10_000);
  }

  private handleClose(client: LineRpcClient) {
    if (this.client !== client) return;
    this.client = null;
    if (this.keepalive) clearInterval(this.keepalive);
    this.keepalive = null;
    this.setStatus({ connected: false });
    if (this.stopped) return;
    this.log('warn', `lost connection to ${this.current?.host}; reconnecting`);
    this.serverIndex++;
    void this.ensureConnected().catch(() => undefined);
  }

  private handleNotification(method: string, params: unknown) {
    if (method === 'blockchain.headers.subscribe' && Array.isArray(params) && params[0]) {
      let tip: ChainTip;
      try {
        tip = normalizeTip(params[0] as { hex: string; height: number });
        this.checkNetwork(tip);
      } catch (err) {
        // A hub announcing an invalid block is broken or lying: leave it for another one.
        this.log('warn', `hub ${this.current?.host} sent an invalid block header (${(err as Error).message}); switching hubs`);
        this.client?.close();
        return;
      }
      this.tip = tip;
      this.lastTipAt = Date.now();
      this.setStatus({ height: tip.height });
      this.emit('tip', tip);
    } else if ((method === 'blockchain.address.subscribe' || method === 'blockchain.scripthash.subscribe') && Array.isArray(params)) {
      const [address, status] = params as [string, string | null];
      this.emit('addressStatus', { address, status: status ? status : null });
    }
  }

  private async rpc<T>(method: string, params: unknown[], timeoutMs?: number): Promise<T> {
    for (let attempt = 0; attempt < 3; attempt++) {
      await this.ensureConnected();
      const client = this.client;
      if (!client) continue;
      try {
        return await client.request<T>(method, params, timeoutMs);
      } catch (err) {
        if (err instanceof RpcError) throw err;
        // transport problem: drop the connection and retry on another server
        this.log('warn', `${method} failed (${(err as Error).message}); retrying`);
        client.close();
      }
    }
    throw new Error(`${method} failed after retries`);
  }

  async getTip(): Promise<ChainTip> {
    await this.ensureConnected();
    if (!this.tip) throw new Error('no tip yet');
    return this.tip;
  }

  async getHeaders(startHeight: number, count: number): Promise<string[]> {
    const result = await this.rpc<{ hex?: string; count: number }>('blockchain.block.headers', [startHeight, count]);
    return splitHeaders(result.hex ?? '');
  }

  /**
   * The same headers from a hub on another host, connected and handshaken like any
   * hub (its tip is checked too), so a lying hub can be caught before coins move on
   * its word. Null when no other hub is configured; throws when none of them answers.
   */
  async crossCheckHeaders(startHeight: number, count: number): Promise<{ server: string; headers: string[] } | null> {
    const current = this.current?.host.toLowerCase();
    const others = this.options.servers.filter((s) => s.host.toLowerCase() !== current);
    if (others.length === 0) return null;
    let lastError: Error | null = null;
    // Up to three of them, from a different starting point each time so the load spreads.
    const start = this.serverIndex % others.length;
    for (let i = 0; i < Math.min(3, others.length); i++) {
      const endpoint = others[(start + i) % others.length]!;
      try {
        const session = await this.open(endpoint);
        try {
          const result = await session.client.request<{ hex?: string; count: number }>('blockchain.block.headers', [startHeight, count], 20_000);
          return { server: `${endpoint.host}:${endpoint.port}`, headers: splitHeaders(result.hex ?? '') };
        } finally {
          session.client.close();
        }
      } catch (err) {
        lastError = err as Error;
        this.log('warn', `cross-check with hub ${endpoint.host}:${endpoint.port} failed: ${lastError.message}`);
      }
    }
    throw lastError ?? new Error('no other hub answered');
  }

  async subscribeAddresses(addresses: string[]): Promise<(string | null)[]> {
    const results: (string | null)[] = [];
    for (const batch of chunk(addresses, SUBSCRIBE_BATCH)) {
      const statuses = await this.rpc<(string | null)[] | string | null>('blockchain.address.subscribe', batch, 60_000);
      const list = Array.isArray(statuses) ? statuses : [statuses];
      if (list.length !== batch.length) throw new Error('hub returned a mismatched subscription result');
      for (const s of list) results.push(s ? s : null);
      for (const a of batch) this.subscribed.add(a);
    }
    return results;
  }

  async getHistory(address: string): Promise<HistoryItem[]> {
    const raw = await this.rpc<{ tx_hash: string; height: number }[]>('blockchain.address.get_history', [address], 60_000);
    return (raw ?? []).map((h) => ({ txid: h.tx_hash, height: h.height }));
  }

  async getTransactions(txids: string[]): Promise<Map<string, FetchedTransaction>> {
    const out = new Map<string, FetchedTransaction>();
    const batches = chunk([...new Set(txids)], TX_BATCH);
    await mapLimit(batches, 4, async (batch) => {
      if (this.batchSupported) {
        try {
          const res = await this.rpc<Record<string, [string | null, { block_height?: number; merkle?: string[]; pos?: number }]>>(
            'blockchain.transaction.get_batch',
            batch,
            120_000,
          );
          for (const txid of batch) {
            const entry = res?.[txid];
            if (!entry || !entry[0]) continue;
            const info = entry[1] ?? {};
            const height = info.block_height && info.block_height > 0 ? info.block_height : 0;
            out.set(txid, {
              hex: entry[0],
              height,
              merkle: height > 0 && Array.isArray(info.merkle) && typeof info.pos === 'number' ? { branch: info.merkle, pos: info.pos } : undefined,
            });
          }
          return;
        } catch (err) {
          if (!(err instanceof RpcError)) throw err;
          this.log('warn', `get_batch unsupported (${err.message}); falling back to transaction.get`);
          this.batchSupported = false;
        }
      }
      await mapLimit(batch, 8, async (txid) => {
        try {
          const res = await this.rpc<unknown>('blockchain.transaction.get', [txid]);
          const hex = typeof res === 'string' ? res : (res as { TxRaw?: string })?.TxRaw;
          if (hex) out.set(txid, { hex, height: -1 });
        } catch (err) {
          if (!(err instanceof RpcError)) throw err;
        }
      });
    });
    return out;
  }

  async broadcast(rawHex: string): Promise<string> {
    try {
      return await this.rpc<string>('blockchain.transaction.broadcast', [rawHex], 60_000);
    } catch (err) {
      // Sent twice (say, retried on another hub after a dropped connection): the network has it, which is what matters.
      if (err instanceof RpcError && /already[- ](have|exists|known|in)/i.test(err.message)) {
        this.log('info', `broadcast: the network already has the transaction (${err.message})`);
        return '';
      }
      throw err;
    }
  }
}

function splitHeaders(hex: string): string[] {
  const out: string[] = [];
  for (let i = 0; i < hex.length; i += HEADER_SIZE * 2) out.push(hex.slice(i, i + HEADER_SIZE * 2));
  return out;
}

function normalizeTip(raw: { hex: string; height: number } | { hex: string; height: number }[]): ChainTip {
  const t = Array.isArray(raw) ? raw[0]! : raw;
  if (!t || typeof t.hex !== 'string' || typeof t.height !== 'number') throw new Error('invalid header notification');
  parseHeader(hexToBytesSafe(t.hex));
  return { height: t.height, header: t.hex };
}

function hexToBytesSafe(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

/** Measures round-trip latency to a hub (used by the server picker in settings). */
export async function probeHub(
  endpoint: SocketEndpoint,
  transportFactory: LineTransportFactory,
  network: NetworkParams,
  clientName: string,
): Promise<{ ok: true; latencyMs: number; height: number; version: string } | { ok: false; error: string }> {
  const client = new LineRpcClient(transportFactory(endpoint), { jsonrpc2: true, defaultTimeoutMs: 8_000 });
  const started = Date.now();
  try {
    await withTimeout(client.connect(), 8_000, 'connect timeout');
    const version = await client.request<[string, string]>('server.version', [clientName, '0.113.0']);
    const tip = normalizeTip(await client.request<{ hex: string; height: number }>('blockchain.headers.subscribe', [true]));
    void network;
    return { ok: true, latencyMs: Date.now() - started, height: tip.height, version: Array.isArray(version) ? String(version[0]) : String(version) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  } finally {
    client.close();
  }
}
