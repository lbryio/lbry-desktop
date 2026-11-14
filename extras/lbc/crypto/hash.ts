// Vendored from bitcoinbrisbane/lBC-wallet-with-mining-ability (MIT), packages/core/src/crypto/hash.ts @ 93e19c1.
// Keep verbatim so it can be refreshed from upstream; bridge-specific code lives outside lib/lbc.

import { sha256 as nobleSha256, sha512 as nobleSha512 } from '@noble/hashes/sha2.js';
import { ripemd160 as nobleRipemd160 } from '@noble/hashes/legacy.js';
import { hmac } from '@noble/hashes/hmac.js';
import { randomBytes as nobleRandomBytes } from '@noble/hashes/utils.js';
import { concatBytes } from '../encoding/bytes.js';

export function sha256(data: Uint8Array): Uint8Array {
  return nobleSha256(data);
}

/** SHA256(SHA256(data)) — transaction ids, block hashes, merkle nodes, checksums. */
export function sha256d(data: Uint8Array): Uint8Array {
  return nobleSha256(nobleSha256(data));
}

export function sha512(data: Uint8Array): Uint8Array {
  return nobleSha512(data);
}

export function ripemd160(data: Uint8Array): Uint8Array {
  return nobleRipemd160(data);
}

/** RIPEMD160(SHA256(data)) — public key hashes and script hashes. */
export function hash160(data: Uint8Array): Uint8Array {
  return nobleRipemd160(nobleSha256(data));
}

export function hmacSha512(key: Uint8Array, data: Uint8Array): Uint8Array {
  return hmac(nobleSha512, key, data);
}

export function hmacSha256(key: Uint8Array, data: Uint8Array): Uint8Array {
  return hmac(nobleSha256, key, data);
}

/** Cryptographically secure random bytes (WebCrypto / Node crypto under the hood). */
export function randomBytes(length: number): Uint8Array {
  return nobleRandomBytes(length);
}

/** Merkle parent of two internal-order hashes. */
export function merkleParent(left: Uint8Array, right: Uint8Array): Uint8Array {
  return sha256d(concatBytes(left, right));
}
