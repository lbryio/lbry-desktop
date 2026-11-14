// Vendored from bitcoinbrisbane/lBC-wallet-with-mining-ability (MIT), packages/core/src/keys/hd.ts @ 93e19c1.
// Keep verbatim so it can be refreshed from upstream; bridge-specific code lives outside lib/lbc.

import { HDKey } from '@scure/bip32';
import { bip39Seed, lbrySeed } from './mnemonic.js';
import { addressFromPublicKey } from '../address.js';
import { wipe } from '../encoding/bytes.js';
import type { NetworkParams } from '../networks.js';

/**
 * Derivation schemes supported by the wallet.
 *
 * - `bip44`: BIP39 seed → m/44'/140'/account' with external chain /0 and change /1.
 *   Interoperable with standard multi-coin wallets that registered LBC (SLIP-44 140).
 * - `lbry`: the LBRY SDK / LBRY Desktop / Odysee scheme. PBKDF2 seed salted with
 *   "lbryum", master key used directly as the account; receiving m/0/i, change m/1/i.
 */
export type DerivationScheme = 'bip44' | 'lbry';

export const CHAIN_RECEIVE = 0;
export const CHAIN_CHANGE = 1;

export interface AccountKeySpec {
  scheme: DerivationScheme | 'xprv' | 'xpub';
  /** For bip44 only. */
  accountIndex?: number;
}

export function versionsFor(network: NetworkParams) {
  return { public: network.bip32.public, private: network.bip32.private };
}

/** Derives the account-level HD key (the parent of the receive/change chains). */
export function deriveAccountKey(
  phrase: string,
  scheme: DerivationScheme,
  network: NetworkParams,
  options: { passphrase?: string; accountIndex?: number } = {},
): HDKey {
  const versions = versionsFor(network);
  if (scheme === 'lbry') {
    const seed = lbrySeed(phrase);
    try {
      return HDKey.fromMasterSeed(seed, versions);
    } finally {
      wipe(seed);
    }
  }
  const seed = bip39Seed(phrase, options.passphrase ?? '');
  try {
    const root = HDKey.fromMasterSeed(seed, versions);
    const account = options.accountIndex ?? 0;
    return root.derive(`m/44'/${network.coinType}'/${account}'`);
  } finally {
    wipe(seed);
  }
}

export function accountKeyFromExtended(extendedKey: string, network: NetworkParams): HDKey {
  try {
    return HDKey.fromExtendedKey(extendedKey.trim(), versionsFor(network));
  } catch {
    throw new Error('Invalid extended key (xprv/xpub) for this network');
  }
}

/** Human-readable derivation path of an address. */
export function describePath(spec: AccountKeySpec, chain: number, index: number, network: NetworkParams): string {
  if (spec.scheme === 'bip44') return `m/44'/${network.coinType}'/${spec.accountIndex ?? 0}'/${chain}/${index}`;
  if (spec.scheme === 'lbry') return `m/${chain}/${index}`;
  return `${spec.scheme}/${chain}/${index}`;
}

/**
 * Public-only address derivation for an account. Caches chain keys and
 * derived addresses since EC point multiplication dominates the cost.
 */
export class AddressDeriver {
  private readonly chains = new Map<number, HDKey>();
  private readonly cache = new Map<string, { address: string; publicKey: Uint8Array }>();

  constructor(
    private readonly accountPublic: HDKey,
    private readonly network: NetworkParams,
  ) {}

  /** Accepts an xpub (or xprv, whose private part is discarded). */
  static fromExtendedKey(extendedKey: string, network: NetworkParams): AddressDeriver {
    return new AddressDeriver(publicOnly(accountKeyFromExtended(extendedKey, network), network), network);
  }

  get xpub(): string {
    return this.accountPublic.publicExtendedKey;
  }

  private chain(chain: number): HDKey {
    let k = this.chains.get(chain);
    if (!k) {
      k = this.accountPublic.deriveChild(chain);
      this.chains.set(chain, k);
    }
    return k;
  }

  derive(chain: number, index: number): { address: string; publicKey: Uint8Array } {
    const id = `${chain}/${index}`;
    const hit = this.cache.get(id);
    if (hit) return hit;
    const child = this.chain(chain).deriveChild(index);
    const publicKey = child.publicKey;
    if (!publicKey) throw new Error('derivation failed');
    const entry = { address: addressFromPublicKey(publicKey, this.network), publicKey };
    this.cache.set(id, entry);
    return entry;
  }
}

/** Strips private material from an HD key. */
export function publicOnly(key: HDKey, network: NetworkParams): HDKey {
  return HDKey.fromExtendedKey(key.publicExtendedKey, versionsFor(network));
}

/** Private key for chain/index under a (private) account key. Caller must wipe the result. */
export function derivePrivateKey(accountPrivate: HDKey, chain: number, index: number): Uint8Array {
  const child = accountPrivate.deriveChild(chain).deriveChild(index);
  if (!child.privateKey) throw new Error('account key has no private key');
  return child.privateKey.slice();
}
