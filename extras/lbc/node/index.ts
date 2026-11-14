// Vendored from bitcoinbrisbane/lBC-wallet-with-mining-ability (MIT), packages/core/src/node/index.ts @ 93e19c1.
// Keep verbatim so it can be refreshed from upstream; bridge-specific code lives outside lib/lbc.

/**
 * Node.js / Electron-main implementations of the core transport interfaces.
 * Kept out of the main entry point so the core stays usable in browsers and
 * React Native.
 */
import net from 'node:net';
import tls from 'node:tls';
import http from 'node:http';
import https from 'node:https';
import { LineSplitter, type ByteTransport, type HttpPost, type LineTransport, type SocketEndpoint } from '../net/transport.js';

export interface NodeSocketOptions {
  connectTimeoutMs?: number;
  /** Optional SOCKS5 proxy (e.g. Tor at 127.0.0.1:9050). */
  socks5?: { host: string; port: number };
}

/** Opens a SOCKS5 tunnel (no auth, domain-name addressing so DNS also goes through the proxy). */
function socks5Connect(proxy: { host: string; port: number }, target: SocketEndpoint, timeoutMs: number): Promise<net.Socket> {
  return new Promise((resolve, reject) => {
    const socket = net.connect(proxy.port, proxy.host);
    const timer = setTimeout(() => {
      socket.destroy();
      reject(new Error('SOCKS5 proxy timeout'));
    }, timeoutMs);
    let stage = 0;
    let buf = Buffer.alloc(0);
    const fail = (msg: string) => {
      clearTimeout(timer);
      socket.destroy();
      reject(new Error(msg));
    };
    socket.once('error', (e) => fail(`SOCKS5 proxy error: ${e.message}`));
    socket.on('connect', () => socket.write(Buffer.from([0x05, 0x01, 0x00])));
    const onData = (d: Buffer) => {
      buf = Buffer.concat([buf, d]);
      if (stage === 0) {
        if (buf.length < 2) return;
        if (buf[0] !== 0x05 || buf[1] !== 0x00) return fail('SOCKS5 proxy refused the connection');
        buf = buf.subarray(2);
        stage = 1;
        const host = Buffer.from(target.host, 'utf8');
        const req = Buffer.concat([Buffer.from([0x05, 0x01, 0x00, 0x03, host.length]), host, Buffer.from([target.port >> 8, target.port & 0xff])]);
        socket.write(req);
      }
      if (stage === 1) {
        if (buf.length < 5) return;
        if (buf[1] !== 0x00) return fail(`SOCKS5 connect failed (code ${buf[1]})`);
        const atyp = buf[3];
        const len = atyp === 0x01 ? 10 : atyp === 0x04 ? 22 : 7 + (buf[4] ?? 0);
        if (buf.length < len) return;
        socket.off('data', onData);
        clearTimeout(timer);
        socket.removeAllListeners('error');
        resolve(socket);
      }
    };
    socket.on('data', onData);
  });
}

/** Connects over TCP, TLS (host name checked) or a SOCKS5 proxy, within the timeout. */
function openSocket(endpoint: SocketEndpoint, options: NodeSocketOptions): Promise<net.Socket> {
  const timeout = options.connectTimeoutMs ?? 10_000;
  return new Promise<net.Socket>((resolve, reject) => {
    const startTls = (raw?: net.Socket) => {
      const s = tls.connect({ host: endpoint.host, port: endpoint.port, servername: net.isIP(endpoint.host) ? undefined : endpoint.host, socket: raw });
      const timer = setTimeout(() => {
        s.destroy();
        reject(new Error('TLS handshake timeout'));
      }, timeout);
      s.once('secureConnect', () => {
        clearTimeout(timer);
        s.removeAllListeners('error');
        resolve(s);
      });
      s.once('error', (e) => {
        clearTimeout(timer);
        reject(e);
      });
    };
    if (options.socks5) {
      socks5Connect(options.socks5, endpoint, timeout)
        .then((raw) => (endpoint.tls ? startTls(raw) : resolve(raw)))
        .catch(reject);
      return;
    }
    if (endpoint.tls) return startTls();
    const s = net.connect({ host: endpoint.host, port: endpoint.port });
    const timer = setTimeout(() => {
      s.destroy();
      reject(new Error('connection timeout'));
    }, timeout);
    s.once('connect', () => {
      clearTimeout(timer);
      s.removeAllListeners('error');
      resolve(s);
    });
    s.once('error', (e) => {
      clearTimeout(timer);
      reject(e);
    });
  });
}

/** Newline-delimited TCP or TLS stream. */
export function nodeLineTransport(endpoint: SocketEndpoint, options: NodeSocketOptions = {}): LineTransport {
  let socket: net.Socket | null = null;
  let lineHandler: (line: string) => void = () => {};
  let closeHandler: (err?: Error) => void = () => {};
  let closed = false;

  const wire = (s: net.Socket) => {
    socket = s;
    s.setEncoding('utf8');
    s.setNoDelay(true);
    s.setKeepAlive(true, 30_000);
    const splitter = new LineSplitter((line) => lineHandler(line));
    s.on('data', (chunk: string) => {
      try {
        splitter.push(chunk);
      } catch (err) {
        s.destroy(err as Error);
      }
    });
    s.on('error', () => undefined);
    s.on('close', (hadError) => {
      if (closed) return;
      closed = true;
      closeHandler(hadError ? new Error('socket error') : undefined);
    });
  };

  return {
    connect: () =>
      openSocket(endpoint, options).then(
        (s) => wire(s),
        (err: Error) => {
          closed = true;
          throw err;
        },
      ),
    send: (line: string) => {
      if (!socket || closed) throw new Error('not connected');
      socket.write(line + '\n');
    },
    close: () => {
      if (closed) return;
      closed = true;
      socket?.destroy();
      closeHandler();
    },
    onLine: (h) => {
      lineHandler = h;
    },
    onClose: (h) => {
      closeHandler = h;
    },
  };
}

/** Raw TCP or TLS byte stream (WebSockets to Nostr relays), through SOCKS5 when set. */
export function nodeByteTransport(endpoint: SocketEndpoint, options: NodeSocketOptions = {}): ByteTransport {
  let socket: net.Socket | null = null;
  let dataHandler: (data: Uint8Array) => void = () => {};
  let closeHandler: (err?: Error) => void = () => {};
  let closed = false;

  return {
    connect: () =>
      openSocket(endpoint, options).then(
        (s) => {
          socket = s;
          s.setNoDelay(true);
          s.setKeepAlive(true, 30_000);
          s.on('data', (chunk: Buffer) => dataHandler(new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength)));
          s.on('error', () => undefined);
          s.on('close', (hadError) => {
            if (closed) return;
            closed = true;
            closeHandler(hadError ? new Error('socket error') : undefined);
          });
        },
        (err: Error) => {
          closed = true;
          throw err;
        },
      ),
    send: (data: Uint8Array) => {
      if (!socket || closed) throw new Error('not connected');
      socket.write(data);
    },
    close: () => {
      if (closed) return;
      closed = true;
      socket?.destroy();
      closeHandler();
    },
    onData: (h) => {
      dataHandler = h;
    },
    onClose: (h) => {
      closeHandler = h;
    },
  };
}

/** HTTP(S) POST for JSON-RPC. `ca` lets users trust lbcd's self-signed rpc.cert. */
export function nodeHttpPost(options: { ca?: string; allowSelfSigned?: boolean } = {}): HttpPost {
  // Keep-alive with few sockets: lbcd allows only 10 RPC clients by default.
  const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 4 });
  const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 4, ca: options.ca, rejectUnauthorized: !options.allowSelfSigned });
  return ({ url, body, headers, timeoutMs }) =>
    new Promise((resolve, reject) => {
      const u = new URL(url);
      const isHttps = u.protocol === 'https:';
      const mod = isHttps ? https : http;
      const req = mod.request(
        {
          hostname: u.hostname,
          port: u.port || (isHttps ? 443 : 80),
          path: u.pathname + u.search,
          method: 'POST',
          headers: { ...headers, 'Content-Length': Buffer.byteLength(body) },
          timeout: timeoutMs,
          agent: isHttps ? httpsAgent : httpAgent,
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on('data', (c: Buffer) => chunks.push(c));
          res.on('end', () => resolve({ status: res.statusCode ?? 0, body: Buffer.concat(chunks).toString('utf8') }));
        },
      );
      req.on('timeout', () => req.destroy(new Error('RPC request timed out')));
      req.on('error', (e) => reject(e));
      req.end(body);
    });
}
