// Vendored from bitcoinbrisbane/lBC-wallet-with-mining-ability (MIT), packages/core/src/net/backend.ts @ 93e19c1.
// Keep verbatim so it can be refreshed from upstream; bridge-specific code lives outside lib/lbc.

import type { Emitter } from '../util/emitter.js';

/** One entry of an address history: height > 0 confirmed, 0 mempool, -1 mempool with unconfirmed parents. */
export interface HistoryItem {
  txid: string;
  height: number;
}

export interface MerkleProof {
  /** Branch hashes in display hex, leaf → root. */
  branch: string[];
  pos: number;
}

export interface FetchedTransaction {
  hex: string;
  /** Block height, or 0 for mempool. */
  height: number;
  merkle?: MerkleProof;
}

export interface ChainTip {
  height: number;
  /** Raw 112-byte header as hex. */
  header: string;
}

export interface BackendStatus {
  connected: boolean;
  kind: 'hub' | 'lbcd';
  /** "host:port" of the hub or node in use. */
  server?: string;
  serverVersion?: string;
  latencyMs?: number;
  height?: number;
  error?: string;
}

export type BackendEvents = {
  tip: ChainTip;
  addressStatus: { address: string; status: string | null };
  status: BackendStatus;
  /** Emitted after a reconnect: subscriptions are lost and the wallet must resync. */
  reconnected: void;
};

/**
 * Everything the wallet engine needs from the network. Implemented by the
 * Electrum-protocol hub client and by the lbcd full-node RPC adapter.
 */
export interface ChainBackend extends Emitter<BackendEvents> {
  readonly kind: 'hub' | 'lbcd';
  /** True when merkle proofs should be checked (untrusted remote servers). */
  readonly untrusted: boolean;
  start(): Promise<void>;
  stop(): Promise<void>;
  getStatus(): BackendStatus;
  getTip(): Promise<ChainTip>;
  /** Raw headers (hex) for consecutive heights. */
  getHeaders(startHeight: number, count: number): Promise<string[]>;
  /**
   * The same headers from a second, independent server, so a lying server can be
   * caught before coins move on its word. Null when no other server is configured.
   */
  crossCheckHeaders?(startHeight: number, count: number): Promise<{ server: string; headers: string[] } | null>;
  /** Subscribes to address status changes and returns current statuses (null = no history). */
  subscribeAddresses(addresses: string[]): Promise<(string | null)[]>;
  getHistory(address: string): Promise<HistoryItem[]>;
  /** Missing transactions are omitted from the result. */
  getTransactions(txids: string[]): Promise<Map<string, FetchedTransaction>>;
  broadcast(rawHex: string): Promise<string>;
}

/** Electrum-style status: sha256 of "txid:height:" concatenated, null when empty. */
export function historyStatus(history: HistoryItem[], sha256Hex: (text: string) => string): string | null {
  if (history.length === 0) return null;
  return sha256Hex(history.map((h) => `${h.txid}:${h.height}:`).join(''));
}
