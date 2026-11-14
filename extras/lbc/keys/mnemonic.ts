// Vendored from bitcoinbrisbane/lBC-wallet-with-mining-ability (MIT), packages/core/src/keys/mnemonic.ts @ 93e19c1.
// Keep verbatim so it can be refreshed from upstream; bridge-specific code lives outside lib/lbc.

import { generateMnemonic as bip39Generate, validateMnemonic as bip39Validate, mnemonicToSeedSync } from '@scure/bip39';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';
import { pbkdf2 } from '@noble/hashes/pbkdf2.js';
import { sha512 } from '@noble/hashes/sha2.js';
import { utf8Encode } from '../encoding/bytes.js';

/** English BIP39 wordlist (also used by the LBRY SDK for its own seeds). */
export const WORDLIST: readonly string[] = english;
const WORDSET = new Set(english);

// CJK ranges from lbry-sdk lbry/wallet/mnemonic.py (between which whitespace is removed).
const CJK_INTERVALS: [number, number][] = [
  [0x4e00, 0x9fff], [0x3400, 0x4dbf], [0x20000, 0x2a6df], [0x2a700, 0x2b73f], [0x2b740, 0x2b81f],
  [0xf900, 0xfaff], [0x2f800, 0x2fa1d], [0x3190, 0x319f], [0x2e80, 0x2eff], [0x2f00, 0x2fdf],
  [0x31c0, 0x31ef], [0x2ff0, 0x2fff], [0xe0100, 0xe01ef], [0x3100, 0x312f], [0x31a0, 0x31bf],
  [0xff00, 0xffef], [0x3040, 0x309f], [0x30a0, 0x30ff], [0x31f0, 0x31ff], [0x1b000, 0x1b0ff],
  [0xac00, 0xd7af], [0x1100, 0x11ff], [0xa960, 0xa97f], [0xd7b0, 0xd7ff], [0x3130, 0x318f],
  [0xa4d0, 0xa4ff], [0x16f00, 0x16f9f], [0xa000, 0xa48f], [0xa490, 0xa4cf],
];

function isCjk(ch: string | undefined): boolean {
  if (!ch) return false;
  const n = ch.codePointAt(0)!;
  return CJK_INTERVALS.some(([a, b]) => n >= a && n <= b);
}

/**
 * LBRY/Electrum text normalisation (lbry-sdk `normalize_text`): NFKD, lower-case,
 * strip combining marks, collapse whitespace, drop whitespace between CJK chars.
 */
export function normalizeLbryText(text: string): string {
  let s = text.normalize('NFKD').toLowerCase();
  s = Array.from(s).filter((c) => !/\p{M}/u.test(c)).join('');
  s = s.split(/\s+/u).filter(Boolean).join(' ');
  const chars = Array.from(s);
  return chars.filter((c, i) => !(/\s/u.test(c) && isCjk(chars[i - 1]) && isCjk(chars[i + 1]))).join('');
}

/** Lower-cases and collapses whitespace so pasted phrases validate predictably. */
export function cleanPhrase(phrase: string): string {
  return phrase.normalize('NFKD').toLowerCase().trim().split(/\s+/u).filter(Boolean).join(' ');
}

export function generateMnemonic(words: 12 | 24 = 12): string {
  return bip39Generate(english, words === 24 ? 256 : 128);
}

/** True when the phrase is a checksum-valid English BIP39 mnemonic. */
export function isValidBip39(phrase: string): boolean {
  return bip39Validate(cleanPhrase(phrase), english);
}

export interface PhraseCheck {
  words: string[];
  unknownWords: string[];
  bip39Valid: boolean;
}

export function checkPhrase(phrase: string): PhraseCheck {
  const words = cleanPhrase(phrase).split(' ').filter(Boolean);
  const unknownWords = words.filter((w) => !WORDSET.has(w));
  return { words, unknownWords, bip39Valid: unknownWords.length === 0 && isValidBip39(phrase) };
}

/** Word suggestions for autocomplete. */
export function suggestWords(prefix: string, limit = 6): string[] {
  const p = prefix.trim().toLowerCase();
  if (!p) return [];
  const out: string[] = [];
  for (const w of english) {
    if (w.startsWith(p)) {
      out.push(w);
      if (out.length >= limit) break;
    }
  }
  return out;
}

/** BIP39 seed: PBKDF2-HMAC-SHA512(mnemonic, "mnemonic" + passphrase, 2048). */
export function bip39Seed(phrase: string, passphrase = ''): Uint8Array {
  return mnemonicToSeedSync(cleanPhrase(phrase), passphrase.normalize('NFKD'));
}

/**
 * LBRY SDK seed (lbry-sdk `Account.get_private_key_from_seed`):
 * PBKDF2-HMAC-SHA512(normalize(phrase), salt = "lbryum", 2048 rounds, 64 bytes).
 * Any phrase is accepted — the LBRY SDK does not enforce a checksum on restore.
 */
export function lbrySeed(phrase: string): Uint8Array {
  return lbryMnemonicToSeed(phrase, 'lbryum');
}

/** lbry-sdk `Mnemonic.mnemonic_to_seed(mnemonic, passphrase)`: the passphrase is the PBKDF2 salt. */
export function lbryMnemonicToSeed(phrase: string, passphrase: string): Uint8Array {
  return pbkdf2(sha512, utf8Encode(normalizeLbryText(phrase)), utf8Encode(normalizeLbryText(passphrase)), { c: 2048, dkLen: 64 });
}
