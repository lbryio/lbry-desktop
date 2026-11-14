// Vendored from bitcoinbrisbane/lBC-wallet-with-mining-ability (MIT), packages/core/src/tx/transaction.ts @ 93e19c1.
// Keep verbatim so it can be refreshed from upstream; bridge-specific code lives outside lib/lbc.

import { ByteReader, ByteWriter, fromHex, hashFromHex, hashToHex, toHex } from '../encoding/bytes.js';
import { sha256d } from '../crypto/hash.js';

export interface TxInput {
  /** Previous transaction id (display hex). */
  txid: string;
  vout: number;
  scriptSig: Uint8Array;
  sequence: number;
  witness: Uint8Array[];
}

export interface TxOutput {
  /** Value in dewies. */
  value: bigint;
  script: Uint8Array;
}

export const SEQUENCE_FINAL = 0xffffffff;
const NULL_TXID = '0'.repeat(64);

/**
 * A Bitcoin-format transaction as used by LBRY (claims are just output scripts).
 * Supports SegWit serialization because lbcd accepts witness transactions.
 */
export class Transaction {
  version = 1;
  locktime = 0;
  inputs: TxInput[] = [];
  outputs: TxOutput[] = [];

  static fromHex(hex: string): Transaction {
    return Transaction.fromBytes(fromHex(hex));
  }

  static fromBytes(bytes: Uint8Array): Transaction {
    const r = new ByteReader(bytes);
    const tx = new Transaction();
    tx.version = r.i32LE();
    let segwit = false;
    if (r.remaining >= 2 && r.peek() === 0x00) {
      // marker 0x00 + flag 0x01
      r.u8();
      const flag = r.u8();
      if (flag !== 0x01) throw new Error('unsupported transaction flag');
      segwit = true;
    }
    const nIn = r.varint();
    for (let i = 0; i < nIn; i++) {
      const prev = r.bytes(32);
      const vout = r.u32LE();
      const scriptSig = r.varBytes();
      const sequence = r.u32LE();
      tx.inputs.push({ txid: hashToHex(prev), vout, scriptSig, sequence, witness: [] });
    }
    const nOut = r.varint();
    for (let i = 0; i < nOut; i++) {
      const value = r.u64LE();
      const script = r.varBytes();
      tx.outputs.push({ value, script });
    }
    if (segwit) {
      for (const input of tx.inputs) {
        const n = r.varint();
        for (let j = 0; j < n; j++) input.witness.push(r.varBytes());
      }
    }
    tx.locktime = r.u32LE();
    if (r.remaining !== 0) throw new Error('trailing bytes after transaction');
    return tx;
  }

  hasWitness(): boolean {
    return this.inputs.some((i) => i.witness.length > 0);
  }

  isCoinbase(): boolean {
    return this.inputs.length === 1 && this.inputs[0]!.txid === NULL_TXID && this.inputs[0]!.vout === 0xffffffff;
  }

  toBytes(options: { witness?: boolean } = {}): Uint8Array {
    const withWitness = (options.witness ?? true) && this.hasWitness();
    const w = new ByteWriter(256);
    w.i32LE(this.version);
    if (withWitness) w.u8(0).u8(1);
    w.varint(this.inputs.length);
    for (const input of this.inputs) {
      w.bytes(hashFromHex(input.txid)).u32LE(input.vout).varBytes(input.scriptSig).u32LE(input.sequence);
    }
    w.varint(this.outputs.length);
    for (const output of this.outputs) w.u64LE(output.value).varBytes(output.script);
    if (withWitness) {
      for (const input of this.inputs) {
        w.varint(input.witness.length);
        for (const item of input.witness) w.varBytes(item);
      }
    }
    w.u32LE(this.locktime);
    return w.toBytes();
  }

  toHex(): string {
    return toHex(this.toBytes());
  }

  /** Transaction id: SHA256d of the non-witness serialization, display order. */
  get txid(): string {
    return hashToHex(sha256d(this.toBytes({ witness: false })));
  }

  get wtxid(): string {
    return hashToHex(sha256d(this.toBytes({ witness: true })));
  }

  get size(): number {
    return this.toBytes().length;
  }

  get weight(): number {
    const base = this.toBytes({ witness: false }).length;
    return base * 3 + this.toBytes().length;
  }

  get vsize(): number {
    return Math.ceil(this.weight / 4);
  }

  clone(): Transaction {
    const tx = new Transaction();
    tx.version = this.version;
    tx.locktime = this.locktime;
    tx.inputs = this.inputs.map((i) => ({ ...i, scriptSig: i.scriptSig.slice(), witness: i.witness.map((x) => x.slice()) }));
    tx.outputs = this.outputs.map((o) => ({ value: o.value, script: o.script.slice() }));
    return tx;
  }

  totalOutput(): bigint {
    return this.outputs.reduce((sum, o) => sum + o.value, 0n);
  }
}
