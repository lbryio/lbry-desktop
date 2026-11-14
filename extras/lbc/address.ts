// Vendored from bitcoinbrisbane/lBC-wallet-with-mining-ability (MIT), packages/core/src/address.ts @ 93e19c1.
// Keep verbatim so it can be refreshed from upstream; bridge-specific code lives outside lib/lbc.

import { base58check as makeBase58check, bech32, bech32m } from '@scure/base';
import { sha256 } from './crypto/hash.js';
import { hash160 } from './crypto/hash.js';
import { concatBytes, toHex } from './encoding/bytes.js';
import { classifyOutput, p2pkhScript, p2shScript, witnessScript } from './script/script.js';
import type { NetworkParams } from './networks.js';

const base58check = makeBase58check(sha256);

export type AddressType = 'p2pkh' | 'p2sh' | 'p2wpkh' | 'p2wsh' | 'p2tr';

/**
 * What address encoding depends on: an LBC network's parameters, or Bitcoin's
 * (for atomic swaps). `symbol` names the coin in error messages (default LBC).
 */
export type AddressParams = Pick<NetworkParams, 'pubKeyHashPrefix' | 'scriptHashPrefix' | 'bech32Hrp'> & { symbol?: string };

export interface DecodedAddress {
  type: AddressType;
  /** Hash or witness program. */
  hash: Uint8Array;
  witnessVersion?: number;
}

export function encodeBase58Address(version: number, hash: Uint8Array): string {
  return base58check.encode(concatBytes(new Uint8Array([version]), hash));
}

export function p2pkhAddress(pubkeyHash: Uint8Array, network: AddressParams): string {
  return encodeBase58Address(network.pubKeyHashPrefix, pubkeyHash);
}

export function addressFromPublicKey(publicKey: Uint8Array, network: AddressParams): string {
  return p2pkhAddress(hash160(publicKey), network);
}

export function encodeSegwitAddress(version: number, program: Uint8Array, network: AddressParams): string {
  const words = [version, ...bech32.toWords(program)];
  return version === 0 ? bech32.encode(network.bech32Hrp, words) : bech32m.encode(network.bech32Hrp, words);
}

/** Decodes and validates an address for the given network. Throws a user-readable error. */
export function decodeAddress(address: string, network: AddressParams): DecodedAddress {
  const text = address.trim();
  if (!text) throw new Error('Address is empty');

  const lower = text.toLowerCase();
  if (lower.startsWith(network.bech32Hrp + '1')) {
    if (text !== lower && text !== text.toUpperCase()) throw new Error('Mixed-case bech32 address');
    let decoded: { prefix: string; words: number[] };
    let isM = false;
    try {
      decoded = bech32.decode(lower as `${string}1${string}`);
    } catch {
      try {
        decoded = bech32m.decode(lower as `${string}1${string}`);
        isM = true;
      } catch {
        throw new Error('Invalid bech32 address checksum');
      }
    }
    if (decoded.prefix !== network.bech32Hrp) throw new Error('Address belongs to another network');
    const [version, ...rest] = decoded.words;
    if (version === undefined || version > 16) throw new Error('Invalid witness version');
    const program = bech32.fromWords(rest);
    if (version === 0) {
      if (isM) throw new Error('Witness v0 must use bech32');
      if (program.length === 20) return { type: 'p2wpkh', hash: program, witnessVersion: 0 };
      if (program.length === 32) return { type: 'p2wsh', hash: program, witnessVersion: 0 };
      throw new Error('Invalid witness program length');
    }
    if (!isM) throw new Error('Witness v1+ must use bech32m');
    if (version === 1 && program.length === 32) return { type: 'p2tr', hash: program, witnessVersion: 1 };
    throw new Error('Unsupported witness address');
  }

  let payload: Uint8Array;
  try {
    payload = base58check.decode(text);
  } catch {
    throw new Error('Invalid address (checksum mismatch or bad characters)');
  }
  if (payload.length !== 21) throw new Error('Invalid address length');
  const version = payload[0];
  const hash = payload.slice(1);
  if (version === network.pubKeyHashPrefix) return { type: 'p2pkh', hash };
  if (version === network.scriptHashPrefix) return { type: 'p2sh', hash };
  throw new Error(`Not ${network.symbol === 'BTC' ? 'a Bitcoin' : 'an LBC'} address for this network`);
}

export function isValidAddress(address: string, network: AddressParams): boolean {
  try {
    decodeAddress(address, network);
    return true;
  } catch {
    return false;
  }
}

/** Output script that pays to `address`. */
export function addressToScript(address: string, network: AddressParams): Uint8Array {
  const d = decodeAddress(address, network);
  switch (d.type) {
    case 'p2pkh':
      return p2pkhScript(d.hash);
    case 'p2sh':
      return p2shScript(d.hash);
    case 'p2wpkh':
    case 'p2wsh':
    case 'p2tr':
      return witnessScript(d.witnessVersion ?? 0, d.hash);
  }
}

/**
 * Address an output pays to, looking through LBRY claim/support prefixes —
 * the same mapping the hubs use to index history. Returns null for
 * non-standard and data-carrier outputs.
 */
export function scriptToAddress(script: Uint8Array, network: AddressParams): string | null {
  const c = classifyOutput(script);
  switch (c.type) {
    case 'p2pkh':
      return encodeBase58Address(network.pubKeyHashPrefix, c.hash!);
    case 'p2sh':
      return encodeBase58Address(network.scriptHashPrefix, c.hash!);
    case 'p2pk':
      return addressFromPublicKey(c.hash!, network);
    case 'p2wpkh':
    case 'p2wsh':
      return encodeSegwitAddress(0, c.hash!, network);
    case 'p2tr':
      return encodeSegwitAddress(1, c.hash!, network);
    default:
      return null;
  }
}

/** Electrum-protocol script hash: sha256(script) reversed, hex. */
export function electrumScriptHash(script: Uint8Array): string {
  return toHex(sha256(script).reverse());
}

/** WIF encoding of a private key (compressed). */
export function encodeWif(privateKey: Uint8Array, network: NetworkParams, compressed = true): string {
  const body = compressed ? concatBytes(new Uint8Array([network.wifPrefix]), privateKey, new Uint8Array([1])) : concatBytes(new Uint8Array([network.wifPrefix]), privateKey);
  return base58check.encode(body);
}

export function decodeWif(wif: string, network: NetworkParams): { privateKey: Uint8Array; compressed: boolean } {
  let payload: Uint8Array;
  try {
    payload = base58check.decode(wif.trim());
  } catch {
    throw new Error('Invalid private key');
  }
  if (payload[0] !== network.wifPrefix) throw new Error('Private key belongs to another network');
  if (payload.length === 34 && payload[33] === 1) return { privateKey: payload.slice(1, 33), compressed: true };
  if (payload.length === 33) return { privateKey: payload.slice(1, 33), compressed: false };
  throw new Error('Invalid private key length');
}
