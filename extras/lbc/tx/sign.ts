// Vendored from bitcoinbrisbane/lBC-wallet-with-mining-ability (MIT), packages/core/src/tx/sign.ts @ 93e19c1.
// Keep verbatim so it can be refreshed from upstream; bridge-specific code lives outside lib/lbc.

import { secp256k1 } from '@noble/curves/secp256k1.js';
import { ByteWriter, concatBytes, equalBytes, hashFromHex } from '../encoding/bytes.js';
import { hash160, sha256d } from '../crypto/hash.js';
import { decompile, parseClaimPrefix, pushData } from '../script/script.js';
import type { Transaction } from './transaction.js';

export const SIGHASH_ALL = 0x01;

/**
 * Legacy (pre-SegWit) signature hash for SIGHASH_ALL.
 *
 * `scriptCode` is the full previous output script — for LBRY claim and support
 * outputs that includes the claim prefix, exactly as lbry-sdk
 * `_serialize_for_signature` and the lbcd script engine (which executes the
 * whole pkScript, treating the claim opcodes as data-dropping NOPs) do.
 */
export function legacySighash(tx: Transaction, inputIndex: number, scriptCode: Uint8Array, hashType = SIGHASH_ALL): Uint8Array {
  if (hashType !== SIGHASH_ALL) throw new Error('only SIGHASH_ALL is supported');
  if (inputIndex < 0 || inputIndex >= tx.inputs.length) throw new Error('input index out of range');
  const w = new ByteWriter(256);
  w.i32LE(tx.version);
  w.varint(tx.inputs.length);
  tx.inputs.forEach((input, i) => {
    w.bytes(hashFromHex(input.txid)).u32LE(input.vout);
    w.varBytes(i === inputIndex ? scriptCode : new Uint8Array(0));
    w.u32LE(input.sequence);
  });
  w.varint(tx.outputs.length);
  for (const output of tx.outputs) w.u64LE(output.value).varBytes(output.script);
  w.u32LE(tx.locktime);
  w.u32LE(hashType);
  return sha256d(w.toBytes());
}

/** Deterministic (RFC 6979), low-S, DER-encoded signature over a 32-byte digest. */
export function signDigest(digest: Uint8Array, privateKey: Uint8Array): Uint8Array {
  return secp256k1.sign(digest, privateKey, { prehash: false, lowS: true, format: 'der' });
}

export function publicKeyOf(privateKey: Uint8Array): Uint8Array {
  return secp256k1.getPublicKey(privateKey, true);
}

/**
 * Signs a pay-to-pubkey-hash input (plain, or wrapped in a claim/support/update
 * prefix) and installs `<sig||hashtype> <pubkey>` as its scriptSig.
 */
export function signP2pkhInput(tx: Transaction, inputIndex: number, prevScript: Uint8Array, privateKey: Uint8Array): void {
  const publicKey = publicKeyOf(privateKey);
  const base = stripPrefix(prevScript);
  if (base.length !== 25 || !equalBytes(base.subarray(3, 23), hash160(publicKey))) {
    throw new Error('private key does not match the output being spent');
  }
  const digest = legacySighash(tx, inputIndex, prevScript, SIGHASH_ALL);
  const sig = concatBytes(signDigest(digest, privateKey), new Uint8Array([SIGHASH_ALL]));
  tx.inputs[inputIndex]!.scriptSig = concatBytes(pushData(sig), pushData(publicKey));
}

function stripPrefix(script: Uint8Array): Uint8Array {
  const prefix = parseClaimPrefix(script);
  return prefix ? script.subarray(prefix.size) : script;
}

/** Verifies a P2PKH(-with-claim-prefix) input signature. Used as a self-check after signing. */
export function verifyP2pkhInput(tx: Transaction, inputIndex: number, prevScript: Uint8Array): boolean {
  const chunks = decompile(tx.inputs[inputIndex]!.scriptSig);
  if (!chunks || chunks.length !== 2 || !chunks[0]!.data || !chunks[1]!.data) return false;
  const sigWithType = chunks[0]!.data;
  const publicKey = chunks[1]!.data;
  if (sigWithType[sigWithType.length - 1] !== SIGHASH_ALL) return false;
  const base = stripPrefix(prevScript);
  if (base.length !== 25 || !equalBytes(base.subarray(3, 23), hash160(publicKey))) return false;
  const digest = legacySighash(tx, inputIndex, prevScript, SIGHASH_ALL);
  try {
    return secp256k1.verify(sigWithType.subarray(0, -1), digest, publicKey, { prehash: false, lowS: true, format: 'der' });
  } catch {
    return false;
  }
}

/** Upper bound of a signed P2PKH input: outpoint 36 + len 1 + push(72) + push(33) + sequence 4. */
export const P2PKH_INPUT_SIZE = 148;
