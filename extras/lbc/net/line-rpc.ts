// Vendored from bitcoinbrisbane/lBC-wallet-with-mining-ability (MIT), packages/core/src/net/line-rpc.ts @ 93e19c1.
// Keep verbatim so it can be refreshed from upstream; bridge-specific code lives outside lib/lbc.

import type { LineTransport } from './transport.js';

export class RpcError extends Error {
  constructor(
    message: string,
    readonly code?: number,
    readonly data?: unknown,
  ) {
    super(message);
    this.name = 'RpcError';
  }
}

export class RpcTimeoutError extends Error {
  constructor(method: string) {
    super(`request ${method} timed out`);
    this.name = 'RpcTimeoutError';
  }
}

export class ConnectionClosedError extends Error {
  constructor() {
    super('connection closed');
    this.name = 'ConnectionClosedError';
  }
}

interface Pending {
  method: string;
  resolve: (v: unknown) => void;
  reject: (e: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

/**
 * JSON-RPC over a newline-delimited stream. Handles request/response matching,
 * timeouts and server-initiated notifications. Used for the Electrum hub
 * protocol (JSON-RPC 2.0) and for Stratum (JSON-RPC 1.0 style).
 */
export class LineRpcClient {
  private nextId = 1;
  private pending = new Map<number, Pending>();
  private closed = false;
  private notificationHandler: (method: string, params: unknown) => void = () => {};
  private closeHandlers: ((error?: Error) => void)[] = [];
  lastReceived = Date.now();
  lastSent = Date.now();

  constructor(
    private readonly transport: LineTransport,
    private readonly options: {
      jsonrpc2?: boolean;
      defaultTimeoutMs?: number;
      /** Receives a note about every well-formed JSON line that is not a message. */
      warn?: (message: string) => void;
    } = {},
  ) {
    transport.onLine((line) => this.handleLine(line));
    transport.onClose((err) => this.handleClose(err));
  }

  async connect(): Promise<void> {
    await this.transport.connect();
  }

  onNotification(handler: (method: string, params: unknown) => void): void {
    this.notificationHandler = handler;
  }

  onClose(handler: (error?: Error) => void): void {
    this.closeHandlers.push(handler);
  }

  get isClosed(): boolean {
    return this.closed;
  }

  get pendingCount(): number {
    return this.pending.size;
  }

  request<T = unknown>(method: string, params: unknown[] | Record<string, unknown> = [], timeoutMs?: number): Promise<T> {
    if (this.closed) return Promise.reject(new ConnectionClosedError());
    const id = this.nextId++;
    const message: Record<string, unknown> = { id, method, params };
    if (this.options.jsonrpc2) message.jsonrpc = '2.0';
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new RpcTimeoutError(method));
      }, timeoutMs ?? this.options.defaultTimeoutMs ?? 30_000);
      this.pending.set(id, { method, resolve: resolve as (v: unknown) => void, reject, timer });
      try {
        this.transport.send(JSON.stringify(message));
        this.lastSent = Date.now();
      } catch (err) {
        clearTimeout(timer);
        this.pending.delete(id);
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });
  }

  private handleLine(line: string): void {
    this.lastReceived = Date.now();
    let msg: unknown;
    try {
      msg = JSON.parse(line);
    } catch {
      return; // ignore garbage lines
    }
    const messages = Array.isArray(msg) ? msg : [msg];
    for (const m of messages) {
      // `null`, numbers, strings, booleans and nested arrays are valid JSON but not messages.
      if (m === null || typeof m !== 'object' || Array.isArray(m)) {
        this.options.warn?.(`ignoring a line that is not a JSON-RPC message: ${line.length > 100 ? `${line.slice(0, 100)}…` : line}`);
        continue;
      }
      this.handleMessage(m as Record<string, unknown>);
    }
  }

  private handleMessage(m: Record<string, unknown>): void {
    if (m && typeof m.method === 'string' && (m.id === undefined || m.id === null || !this.pending.has(m.id as number))) {
      this.notificationHandler(m.method, m.params);
      return;
    }
    const id = m.id as number;
    const p = this.pending.get(id);
    if (!p) return;
    this.pending.delete(id);
    clearTimeout(p.timer);
    const error = m.error as unknown;
    if (error !== undefined && error !== null && error !== false) {
      p.reject(toRpcError(error));
    } else {
      p.resolve(m.result);
    }
  }

  private handleClose(err?: Error): void {
    if (this.closed) return;
    this.closed = true;
    for (const [, p] of this.pending) {
      clearTimeout(p.timer);
      p.reject(new ConnectionClosedError());
    }
    this.pending.clear();
    for (const h of this.closeHandlers) h(err);
  }

  close(): void {
    try {
      this.transport.close();
    } finally {
      this.handleClose();
    }
  }
}

function toRpcError(error: unknown): RpcError {
  if (typeof error === 'string') return new RpcError(error);
  if (Array.isArray(error)) {
    // Stratum style: [code, message, traceback]
    return new RpcError(String(error[1] ?? 'error'), typeof error[0] === 'number' ? error[0] : undefined, error[2]);
  }
  if (error && typeof error === 'object') {
    const e = error as { message?: unknown; code?: unknown; data?: unknown };
    return new RpcError(String(e.message ?? JSON.stringify(error)), typeof e.code === 'number' ? e.code : undefined, e.data);
  }
  return new RpcError(String(error));
}
