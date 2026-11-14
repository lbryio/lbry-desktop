// Vendored from bitcoinbrisbane/lBC-wallet-with-mining-ability (MIT), packages/core/src/net/transport.ts @ 93e19c1.
// Keep verbatim so it can be refreshed from upstream; bridge-specific code lives outside lib/lbc.

/**
 * Transport abstractions. The core never opens sockets itself: the desktop app
 * injects Node TCP/TLS sockets, a future mobile app can inject React Native
 * sockets, and tests inject in-memory pipes.
 */

export interface SocketEndpoint {
  host: string;
  port: number;
  tls?: boolean;
}

/** A newline-delimited text stream (Electrum protocol, Stratum). */
export interface LineTransport {
  connect(): Promise<void>;
  /** Sends one line; the transport appends the newline. */
  send(line: string): void;
  close(): void;
  onLine(handler: (line: string) => void): void;
  onClose(handler: (error?: Error) => void): void;
}

export type LineTransportFactory = (endpoint: SocketEndpoint) => LineTransport;

/** A raw byte stream (WebSocket connections to Nostr relays). */
export interface ByteTransport {
  connect(): Promise<void>;
  send(data: Uint8Array): void;
  close(): void;
  onData(handler: (data: Uint8Array) => void): void;
  onClose(handler: (error?: Error) => void): void;
}

export type ByteTransportFactory = (endpoint: SocketEndpoint) => ByteTransport;

/** Performs an HTTP POST of a JSON body and resolves with the response body text. */
export type HttpPost = (request: {
  url: string;
  body: string;
  headers: Record<string, string>;
  timeoutMs: number;
}) => Promise<{ status: number; body: string }>;

/** Buffers raw chunks and yields complete lines (shared by transport implementations). */
export class LineSplitter {
  private buffer = '';

  constructor(
    private readonly onLine: (line: string) => void,
    private readonly maxLineLength = 64 * 1024 * 1024,
  ) {}

  push(chunk: string): void {
    this.buffer += chunk;
    let idx: number;
    while ((idx = this.buffer.indexOf('\n')) >= 0) {
      const line = this.buffer.slice(0, idx).replace(/\r$/, '');
      this.buffer = this.buffer.slice(idx + 1);
      if (line.trim()) this.onLine(line);
    }
    if (this.buffer.length > this.maxLineLength) {
      this.buffer = '';
      throw new Error('line too long');
    }
  }
}
