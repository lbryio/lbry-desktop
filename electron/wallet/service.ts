// What the app asks of the wallet beyond the keys: which addresses are in use. Uses the hub client from
// extras/lbc and the public key in the wallet file, so it needs no password.
import { accountKeyFromExtended } from "../../extras/lbc/keys/hd";
import { addressFromPublicKey } from "../../extras/lbc/address";
import { getNetwork } from "../../extras/lbc/networks";
import type { WalletAddress, WalletStore } from "./store";

/** The part of the hub backend this needs; HubBackend satisfies it, and tests supply a fake. */
export interface AddressStatusSource {
  subscribeAddresses(addresses: string[]): Promise<(string | null)[]>;
}

// lbry-sdk's default address generator: lbry/wallet/account.py
export const RECEIVING_GAP = 20;
export const CHANGE_GAP = 6;
// Bounds one scan, so a hub that reports every address as used cannot make a request run forever.
const MAX_ADDRESSES_PER_CHAIN = 1000;

export interface UsedAddress extends WalletAddress {
  used: boolean;
}

// The status of an address with no history is null (Python hubs) or "" (herald.go).
const isUsed = (status: string | null | undefined) => status !== null && status !== undefined && status !== "";

export class WalletService {
  private backend: Promise<AddressStatusSource> | null = null;

  constructor(
    private readonly store: WalletStore,
    private readonly connect: () => Promise<AddressStatusSource>
  ) {}

  private hub(): Promise<AddressStatusSource> {
    if (!this.backend) {
      this.backend = this.connect().catch((e) => {
        this.backend = null; // try again next time instead of caching the failure
        throw e;
      });
    }
    return this.backend;
  }

  private async mark(addresses: WalletAddress[]): Promise<UsedAddress[]> {
    const statuses = await (await this.hub()).subscribeAddresses(addresses.map((a) => a.address));
    return addresses.map((a, i) => ({ ...a, used: isUsed(statuses[i]) }));
  }

  /** Addresses of a chain up to a full gap of unused ones after the last used one (the SDK's rule). */
  async scanChain(chain: number, gap: number): Promise<UsedAddress[]> {
    const all: UsedAddress[] = [];
    let lastUsed = -1;
    for (let start = 0; start < MAX_ADDRESSES_PER_CHAIN; start += gap) {
      const batch = await this.mark(this.store.addresses(chain, start, gap));
      batch.forEach((a) => a.used && (lastUsed = a.index));
      all.push(...batch);
      if (start + gap - 1 - lastUsed >= gap) break;
    }
    return all;
  }

  /** The first receiving address with no history (lbry-sdk's address_unused). */
  async addressUnused(): Promise<string> {
    for (let start = 0; start < MAX_ADDRESSES_PER_CHAIN; start += RECEIVING_GAP) {
      const unused = (await this.mark(this.store.addresses(0, start, RECEIVING_GAP))).find((a) => !a.used);
      if (unused) return unused.address;
    }
    throw new Error("Every address in the first 1000 has been used.");
  }

  /** lbry-sdk's address_list: Paginated[Address], receiving addresses first. */
  async addressList(params: { page?: number; page_size?: number; address?: string } = {}) {
    const { id } = this.account();
    const receiving = await this.scanChain(0, RECEIVING_GAP);
    const change = await this.scanChain(1, CHANGE_GAP);
    let items = receiving.concat(change).map((a) => ({
      address: a.address,
      account: id,
      used_times: a.used ? 1 : 0,
      pubkey: "",
      chain_code: "",
      n: a.index,
      depth: 5,
      chain: a.chain,
    }));
    if (params.address) items = items.filter((i) => i.address === params.address);
    return paginate(items, params.page, params.page_size);
  }

  /** The wallet's account as lbry-sdk's account_list reports it (no seed: that needs the password). */
  account() {
    const status = this.store.status();
    if (!status.exists || !status.xpub || !status.network) throw new Error("There is no wallet yet.");
    const network = getNetwork(status.network);
    return {
      // The SDK names an account by the address of its public key.
      id: addressFromPublicKey(hdPublicKey(status.xpub, network), network),
      name: status.name || "My Wallet",
      is_default: true,
      ledger: status.network === "mainnet" ? "lbc_mainnet" : `lbc_${status.network}`,
      encrypted: true,
      public_key: status.xpub,
      address_generator: {
        name: "deterministic-chain",
        receiving: { gap: RECEIVING_GAP, maximum_uses_per_address: 1 },
        change: { gap: CHANGE_GAP, maximum_uses_per_address: 1 },
      },
      satoshis: 0,
      locked: status.locked,
    };
  }

  accountList() {
    const account = this.account();
    // The paginated shape (walletSeed) and the per-ledger shape (sync.ts) the UI reads.
    return { ...paginate([account], 1, 20), lbc_mainnet: [account], lbc_testnet: [] as unknown[] };
  }
}

function hdPublicKey(xpub: string, network: ReturnType<typeof getNetwork>): Uint8Array {
  const key = accountKeyFromExtended(xpub, network);
  if (!key.publicKey) throw new Error("The wallet's public key is invalid.");
  return key.publicKey;
}

export function paginate<T>(items: T[], page = 1, pageSize = 20) {
  const size = Math.min(Math.max(Math.floor(pageSize) || 20, 1), 50);
  const current = Math.max(Math.floor(page) || 1, 1);
  const total = items.length;
  return {
    items: items.slice((current - 1) * size, current * size),
    page: current,
    page_size: size,
    total_items: total,
    total_pages: Math.ceil(total / size),
  };
}
