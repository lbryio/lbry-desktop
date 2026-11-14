// Vendored from bitcoinbrisbane/lBC-wallet-with-mining-ability (MIT), packages/core/src/crypto/pow.ts @ 93e19c1.
// Keep verbatim so it can be refreshed from upstream; bridge-specific code lives outside lib/lbc.

import { sha256d, sha512, ripemd160 } from './hash.js';
import { concatBytes, readU32LE, toHex, reverseBytes } from '../encoding/bytes.js';

/** LBRY block headers are 112 bytes: the Bitcoin layout plus a 32-byte claimtrie root. */
export const HEADER_SIZE = 112;

/**
 * The LBRY proof-of-work hash, exactly as in lbcd `chainhash.LbryPoWHashH`:
 *
 *   doubled  = SHA256(SHA256(header))
 *   expanded = SHA512(doubled)
 *   left     = RIPEMD160(expanded[0:32])
 *   right    = RIPEMD160(expanded[32:64])
 *   result   = SHA256(SHA256(left || right))
 *
 * The result is compared, as a little-endian 256-bit integer, against the target.
 * This is the reference implementation; the miner uses an optimised WASM build.
 */
export function lbryPowHash(header: Uint8Array): Uint8Array {
  const doubled = sha256d(header);
  const expanded = sha512(doubled);
  const left = ripemd160(expanded.subarray(0, 32));
  const right = ripemd160(expanded.subarray(32, 64));
  return sha256d(concatBytes(left, right));
}

/** Block hash (block id) = SHA256d of the header, internal byte order. */
export function blockHash(header: Uint8Array): Uint8Array {
  return sha256d(header);
}

/** Interprets an internal-order 32-byte hash as a little-endian unsigned integer. */
export function hashToBigInt(hash: Uint8Array): bigint {
  let v = 0n;
  for (let i = hash.length - 1; i >= 0; i--) v = (v << 8n) | BigInt(hash[i]!);
  return v;
}

/** Converts a 256-bit target to 32 little-endian bytes (comparable with hashes). */
export function bigIntToHash(value: bigint): Uint8Array {
  const out = new Uint8Array(32);
  let v = value;
  for (let i = 0; i < 32; i++) {
    out[i] = Number(v & 0xffn);
    v >>= 8n;
  }
  return out;
}

/** Decodes the compact "nBits" representation into a full 256-bit target. */
export function bitsToTarget(bits: number): bigint {
  const exponent = bits >>> 24;
  let mantissa = BigInt(bits & 0x007fffff);
  if (bits & 0x00800000) return 0n; // negative targets are invalid
  if (exponent <= 3) return mantissa >> BigInt(8 * (3 - exponent));
  mantissa <<= BigInt(8 * (exponent - 3));
  return mantissa;
}

/** Encodes a 256-bit target into compact nBits form. */
export function targetToBits(target: bigint): number {
  if (target <= 0n) return 0;
  let size = 0;
  for (let t = target; t > 0n; t >>= 8n) size++;
  let compact: number;
  if (size <= 3) {
    compact = Number(target << BigInt(8 * (3 - size)));
  } else {
    compact = Number(target >> BigInt(8 * (size - 3)));
  }
  if (compact & 0x00800000) {
    compact >>= 8;
    size++;
  }
  return ((size << 24) | (compact & 0x007fffff)) >>> 0;
}

/** Expected number of hashes needed to find a hash at or below `target`. */
export function workForTarget(target: bigint): bigint {
  if (target <= 0n) return 0n;
  return (1n << 256n) / (target + 1n);
}

export interface ParsedHeader {
  version: number;
  prevHash: string; // display hex
  merkleRoot: string; // display hex
  claimTrieRoot: string; // display hex
  timestamp: number;
  bits: number;
  nonce: number;
  hash: string; // display hex block id
}

export function parseHeader(header: Uint8Array): ParsedHeader {
  if (header.length !== HEADER_SIZE) throw new Error(`header must be ${HEADER_SIZE} bytes`);
  return {
    version: readU32LE(header, 0) | 0,
    prevHash: toHex(reverseBytes(header.subarray(4, 36))),
    merkleRoot: toHex(reverseBytes(header.subarray(36, 68))),
    claimTrieRoot: toHex(reverseBytes(header.subarray(68, 100))),
    timestamp: readU32LE(header, 100),
    bits: readU32LE(header, 104),
    nonce: readU32LE(header, 108),
    hash: toHex(reverseBytes(blockHash(header))),
  };
}

/** True when the header's LBRY PoW hash satisfies its own nBits (and the network limit). */
export function checkProofOfWork(header: Uint8Array, powLimit: bigint): boolean {
  const bits = readU32LE(header, 104);
  const target = bitsToTarget(bits);
  if (target <= 0n || target > powLimit) return false;
  return hashToBigInt(lbryPowHash(header)) <= target;
}
