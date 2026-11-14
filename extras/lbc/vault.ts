// Vendored from bitcoinbrisbane/lBC-wallet-with-mining-ability (MIT), packages/core/src/vault.ts @ 93e19c1.
// Keep verbatim so it can be refreshed from upstream; app-specific code lives outside extras/lbc.

import { gcm } from '@noble/ciphers/aes.js';
import { scryptAsync } from '@noble/hashes/scrypt.js';
import { randomBytes } from './crypto/hash.js';
import { fromHex, toHex, utf8Decode, utf8Encode, wipe } from './encoding/bytes.js';

/**
 * Password-based encryption for secrets at rest.
 *
 *   key        = scrypt(password, salt, N=2^17, r=8, p=1) → 32 bytes
 *   ciphertext = AES-256-GCM(key, 96-bit random nonce, aad = "lbcwallet/v1:<purpose>")
 *
 * GCM authenticates the ciphertext, so a wrong password (or tampering) is
 * detected reliably instead of yielding garbage.
 */

export interface KdfParams {
  name: 'scrypt';
  N: number;
  r: number;
  p: number;
  salt: string;
}

export interface SealedBox {
  version: 1;
  kdf?: KdfParams;
  cipher: { name: 'aes-256-gcm'; nonce: string };
  ciphertext: string;
}

export class WrongPasswordError extends Error {
  constructor() {
    super('Incorrect password');
    this.name = 'WrongPasswordError';
  }
}

export const DEFAULT_KDF = { N: 1 << 17, r: 8, p: 1 };

function aad(purpose: string): Uint8Array {
  return utf8Encode(`lbcwallet/v1:${purpose}`);
}

export async function deriveKey(password: string, kdf: KdfParams): Promise<Uint8Array> {
  if (kdf.name !== 'scrypt') throw new Error('unsupported KDF');
  return scryptAsync(utf8Encode(password.normalize('NFKC')), fromHex(kdf.salt), { N: kdf.N, r: kdf.r, p: kdf.p, dkLen: 32, maxmem: 1024 * 1024 * 1024 });
}

/** Encrypts with a raw 32-byte key (no KDF). */
export function sealWithKey(plaintext: Uint8Array, key: Uint8Array, purpose: string): SealedBox {
  const nonce = randomBytes(12);
  const ciphertext = gcm(key, nonce, aad(purpose)).encrypt(plaintext);
  return { version: 1, cipher: { name: 'aes-256-gcm', nonce: toHex(nonce) }, ciphertext: toHex(ciphertext) };
}

export function openWithKey(box: SealedBox, key: Uint8Array, purpose: string): Uint8Array {
  if (box.version !== 1 || box.cipher.name !== 'aes-256-gcm') throw new Error('unsupported vault format');
  try {
    return gcm(key, fromHex(box.cipher.nonce), aad(purpose)).decrypt(fromHex(box.ciphertext));
  } catch {
    throw new WrongPasswordError();
  }
}

/** Encrypts with a password. KDF cost parameters are stored alongside the ciphertext. */
export async function sealWithPassword(plaintext: Uint8Array, password: string, purpose: string, cost = DEFAULT_KDF): Promise<SealedBox> {
  const kdf: KdfParams = { name: 'scrypt', ...cost, salt: toHex(randomBytes(16)) };
  const key = await deriveKey(password, kdf);
  try {
    return { ...sealWithKey(plaintext, key, purpose), kdf };
  } finally {
    wipe(key);
  }
}

export async function openWithPassword(box: SealedBox, password: string, purpose: string): Promise<Uint8Array> {
  if (!box.kdf) throw new Error('vault has no KDF parameters');
  const key = await deriveKey(password, box.kdf);
  try {
    return openWithKey(box, key, purpose);
  } finally {
    wipe(key);
  }
}

export async function sealJson(value: unknown, password: string, purpose: string, cost = DEFAULT_KDF): Promise<SealedBox> {
  const bytes = utf8Encode(JSON.stringify(value));
  try {
    return await sealWithPassword(bytes, password, purpose, cost);
  } finally {
    wipe(bytes);
  }
}

export async function openJson<T>(box: SealedBox, password: string, purpose: string): Promise<T> {
  const bytes = await openWithPassword(box, password, purpose);
  try {
    return JSON.parse(utf8Decode(bytes)) as T;
  } finally {
    wipe(bytes);
  }
}

/** Rough password strength score 0–4 for UI feedback (length + character classes + patterns). */
export function passwordStrength(password: string): { score: 0 | 1 | 2 | 3 | 4; hint: string } {
  if (!password) return { score: 0, hint: 'Enter a password' };
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/\d/.test(password)) pool += 10;
  if (/[^A-Za-z0-9]/.test(password)) pool += 33;
  let bits = password.length * Math.log2(Math.max(pool, 1));
  if (/(.)\1{2,}/.test(password)) bits -= 10;
  if (/^(password|qwerty|letmein|123456|admin|welcome)/i.test(password)) bits = Math.min(bits, 10);
  if (password.length < 8) return { score: 0, hint: 'Use at least 8 characters' };
  if (bits < 40) return { score: 1, hint: 'Weak — add length or mix character types' };
  if (bits < 60) return { score: 2, hint: 'Fair — a longer passphrase is better' };
  if (bits < 80) return { score: 3, hint: 'Good' };
  return { score: 4, hint: 'Strong' };
}
