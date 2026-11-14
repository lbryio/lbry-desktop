// Vendored from bitcoinbrisbane/lBC-wallet-with-mining-ability (MIT), packages/core/src/tx/builder.ts @ 93e19c1.
// Keep verbatim so it can be refreshed from upstream; bridge-specific code lives outside lib/lbc.

import { DUST_THRESHOLD } from '../networks.js';
import { P2PKH_INPUT_SIZE, signP2pkhInput, verifyP2pkhInput } from './sign.js';
import { SEQUENCE_FINAL, Transaction, type TxOutput } from './transaction.js';

/** A spendable output owned by the wallet. */
export interface Utxo {
  txid: string;
  vout: number;
  value: bigint;
  /** Full output script (including any claim/support prefix). */
  script: Uint8Array;
  /** Wallet address the output pays to. */
  address: string;
  /** Block height, or 0 when unconfirmed. */
  height: number;
}

export interface Recipient {
  script: Uint8Array;
  value: bigint;
}

/** Serialized size of an output: value 8 + varint + script. */
export function outputSize(script: Uint8Array): number {
  const len = script.length;
  return 8 + (len < 0xfd ? 1 : len <= 0xffff ? 3 : 5) + len;
}

function varintSize(n: number): number {
  return n < 0xfd ? 1 : n <= 0xffff ? 3 : 5;
}

/** Estimated size of a transaction spending `inputCount` P2PKH-style inputs. */
export function estimateSize(inputCount: number, outputScripts: Uint8Array[]): number {
  return (
    4 + // version
    varintSize(inputCount) +
    inputCount * P2PKH_INPUT_SIZE +
    varintSize(outputScripts.length) +
    outputScripts.reduce((sum, s) => sum + outputSize(s), 0) +
    4 // locktime
  );
}

export function feeFor(size: number, feePerByte: number): bigint {
  return BigInt(Math.ceil(size * feePerByte));
}

/**
 * Inputs one transaction may spend. lbcd refuses transactions above 400,000 weight units
 * (about 675 pay-to-pubkey-hash inputs); the rest of the coins wait for another transaction.
 */
export const MAX_INPUTS = 600;

export class TooManyInputsError extends Error {
  constructor(
    readonly max: number,
    readonly coins: number,
  ) {
    super('Too many coins for one transaction');
    this.name = 'TooManyInputsError';
  }
}

export class InsufficientFundsError extends Error {
  constructor(
    readonly needed: bigint,
    readonly available: bigint,
  ) {
    super('Insufficient funds');
    this.name = 'InsufficientFundsError';
  }
}

export interface Selection {
  inputs: Utxo[];
  fee: bigint;
  change: bigint;
  size: number;
}

/**
 * Chooses inputs covering `recipients` plus fee.
 *
 * Candidates are tried as (1) the smallest single coin that covers the payment,
 * which avoids needless consolidation and leaves small change, then (2) a
 * largest-first accumulation. Change below the dust threshold is added to the fee.
 */
export function selectCoins(utxos: Utxo[], recipients: Recipient[], changeScript: Uint8Array, feePerByte: number): Selection {
  const target = recipients.reduce((s, r) => s + r.value, 0n);
  const outScripts = recipients.map((r) => r.script);
  const available = utxos.reduce((s, u) => s + u.value, 0n);

  const evaluate = (inputs: Utxo[]): Selection | null => {
    const total = inputs.reduce((s, u) => s + u.value, 0n);
    const sizeWithChange = estimateSize(inputs.length, [...outScripts, changeScript]);
    const feeWithChange = feeFor(sizeWithChange, feePerByte);
    const change = total - target - feeWithChange;
    if (change >= DUST_THRESHOLD) return { inputs, fee: feeWithChange, change, size: sizeWithChange };
    const sizeNoChange = estimateSize(inputs.length, outScripts);
    const feeNoChange = feeFor(sizeNoChange, feePerByte);
    if (total - target >= feeNoChange) return { inputs, fee: total - target, change: 0n, size: sizeNoChange };
    return null;
  };

  // Confirmed coins are always preferred over unconfirmed ones.
  const byValue = (list: Utxo[], dir: 1 | -1) => [...list].sort((a, b) => (a.value < b.value ? -dir : a.value > b.value ? dir : 0));
  const confirmed = utxos.filter((u) => u.height > 0);
  const unconfirmed = utxos.filter((u) => u.height <= 0);
  const sorted = [...byValue(confirmed, -1), ...byValue(unconfirmed, -1)];

  let best: Selection | null = null;
  for (const u of [...byValue(confirmed, 1), ...byValue(unconfirmed, 1)]) {
    const s = evaluate([u]);
    if (s) {
      best = s;
      break;
    }
  }
  if (!best) {
    const acc: Utxo[] = [];
    for (const u of sorted) {
      if (acc.length >= MAX_INPUTS) throw new TooManyInputsError(MAX_INPUTS, sorted.length);
      acc.push(u);
      const s = evaluate(acc);
      if (s) {
        best = s;
        break;
      }
    }
  }
  if (!best) {
    const fee = feeFor(estimateSize(Math.max(sorted.length, 1), [...outScripts, changeScript]), feePerByte);
    throw new InsufficientFundsError(target + fee, available);
  }
  return best;
}

/**
 * Spends the given coins to a single output (send max / sweep / unlock supports). With more coins
 * than one transaction may carry, the largest MAX_INPUTS are spent and the rest wait for the next.
 */
export function selectAll(utxos: Utxo[], destinationScript: Uint8Array, feePerByte: number): { inputs: Utxo[]; value: bigint; fee: bigint; size: number } {
  const inputs = utxos.length > MAX_INPUTS ? [...utxos].sort((a, b) => (a.value < b.value ? 1 : a.value > b.value ? -1 : 0)).slice(0, MAX_INPUTS) : utxos;
  const total = inputs.reduce((s, u) => s + u.value, 0n);
  const size = estimateSize(inputs.length, [destinationScript]);
  const fee = feeFor(size, feePerByte);
  const value = total - fee;
  if (inputs.length === 0 || value < DUST_THRESHOLD) throw new InsufficientFundsError(fee + DUST_THRESHOLD, total);
  return { inputs, value, fee, size };
}

export interface UnsignedPayment {
  tx: Transaction;
  inputs: Utxo[];
  fee: bigint;
  change: bigint;
  /** Index of the change output, or -1. */
  changeIndex: number;
}

/** Assembles an unsigned transaction. Outputs are kept in the given order with change last. */
export function assembleTransaction(inputs: Utxo[], outputs: TxOutput[], change?: TxOutput): UnsignedPayment {
  const tx = new Transaction();
  tx.version = 1;
  tx.locktime = 0;
  for (const u of inputs) tx.inputs.push({ txid: u.txid, vout: u.vout, scriptSig: new Uint8Array(0), sequence: SEQUENCE_FINAL, witness: [] });
  tx.outputs.push(...outputs.map((o) => ({ value: o.value, script: o.script })));
  let changeIndex = -1;
  if (change && change.value > 0n) {
    changeIndex = tx.outputs.length;
    tx.outputs.push(change);
  }
  const totalIn = inputs.reduce((s, u) => s + u.value, 0n);
  return { tx, inputs, fee: totalIn - tx.totalOutput(), change: change?.value ?? 0n, changeIndex };
}

/**
 * Signs every input with keys supplied by `keyFor(address)` and verifies each
 * signature before returning, so a corrupted key or bug can never broadcast junk.
 */
export function signTransaction(payment: UnsignedPayment, keyFor: (utxo: Utxo) => Uint8Array): Transaction {
  const tx = payment.tx.clone();
  payment.inputs.forEach((utxo, i) => {
    const key = keyFor(utxo);
    try {
      signP2pkhInput(tx, i, utxo.script, key);
    } finally {
      key.fill(0);
    }
  });
  payment.inputs.forEach((utxo, i) => {
    if (!verifyP2pkhInput(tx, i, utxo.script)) throw new Error(`signature self-check failed for input ${i}`);
  });
  return tx;
}
