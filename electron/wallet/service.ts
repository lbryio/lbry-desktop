// What the app asks of the wallet beyond the keys: which addresses are in use. Uses the hub client from
// extras/lbc and the public key in the wallet file, so it needs no password.
import { accountKeyFromExtended } from "../../extras/lbc/keys/hd";
import { addressFromPublicKey } from "../../extras/lbc/address";
import { getNetwork } from "../../extras/lbc/networks";
import type { WalletAddress, WalletStore } from "./store";
import { balanceOf, dewiesToString, unspentOutputs, type Balance, type OwnedOutput } from "./balance";
import { WalletLockedError } from "./store";
import { addressToScript, isValidAddress } from "../../extras/lbc/address";
import { DEFAULT_FEE_PER_BYTE } from "../../extras/lbc/networks";
import { assembleTransaction, selectCoins, signTransaction, type Utxo } from "../../extras/lbc/tx/builder";

/** The part of the hub backend this needs; HubBackend satisfies it, and tests supply a fake. */
export interface AddressStatusSource {
  subscribeAddresses(addresses: string[]): Promise<(string | null)[]>;
}

/** What the balance needs on top of that: the history of an address and the transactions in it. */
export interface TransactionSource {
  getHistory(address: string): Promise<{ txid: string; height: number }[]>;
  getTransactions(txids: string[]): Promise<Map<string, { hex: string; height: number }>>;
  broadcast(rawHex: string): Promise<string>;
}

// lbry-sdk's default address generator: lbry/wallet/account.py
export const RECEIVING_GAP = 20;
export const CHANGE_GAP = 6;
const BALANCE_CACHE_MS = 10_000;
// Outputs a sent transaction spent are not offered again for this long, until the hub shows the spend.
const PENDING_SPEND_MS = 10 * 60 * 1000;
// Refuse a payment whose fee is more than this, whatever the rate: a bug or a hostile hub must not drain a wallet.
const MAX_FEE_DEWIES = 100_000_000n;
// Bounds one scan, so a hub that reports every address as used cannot make a request run forever.
const MAX_ADDRESSES_PER_CHAIN = 1000;

export interface UsedAddress extends WalletAddress {
  used: boolean;
}

// The status of an address with no history is null (Python hubs) or "" (herald.go).
const isUsed = (status: string | null | undefined) => status !== null && status !== undefined && status !== "";

export class WalletService {
  private backend: Promise<AddressStatusSource & Partial<TransactionSource>> | null = null;

  constructor(
    private readonly store: WalletStore,
    private readonly connect: () => Promise<AddressStatusSource & Partial<TransactionSource>>
  ) {}

  private hub(): Promise<AddressStatusSource & Partial<TransactionSource>> {
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

  /**
   * The first receiving address with no history (lbry-sdk's address_unused). With `exclude`, the first one that is
   * not that address, so "Get New Address" gives a different one while the shown address is still unused. It stays
   * inside the gap after the last used address (the SDK's rule), so a restore from the phrase still finds every
   * address that has been handed out; past that, it keeps returning the last one inside it.
   */
  async addressUnused(params: { exclude?: string } = {}): Promise<string> {
    const exclude = typeof params.exclude === "string" ? params.exclude : "";
    const window = await this.scanChain(0, RECEIVING_GAP);
    const unused = window.filter((a) => !a.used);
    if (!unused.length) throw new Error("Every address in the first 1000 has been used.");
    return (unused.find((a) => a.address !== exclude) || unused[unused.length - 1]).address;
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

  private balanceCache: { at: number; result: Promise<Balance> } | null = null;

  /**
   * lbry-sdk's wallet_balance. The app asks often, and each answer takes a scan of the addresses and their
   * transactions, so one answer is shared for a few seconds (and by calls that arrive while it is being worked out).
   */
  balance(): Promise<Balance> {
    const cached = this.balanceCache;
    if (cached && Date.now() - cached.at < BALANCE_CACHE_MS) return cached.result;
    const result = this.computeBalance();
    this.balanceCache = { at: Date.now(), result };
    // A failure is not worth keeping: the next call tries again.
    result.catch(() => {
      if (this.balanceCache && this.balanceCache.result === result) this.balanceCache = null;
    });
    return result;
  }

  private async computeBalance(): Promise<Balance> {
    return balanceOf((await this.ownedOutputs()).outputs);
  }

  /** The wallet's unspent outputs, with where each address sits in the key tree. Works while locked. */
  private async ownedOutputs(): Promise<{ outputs: OwnedOutput[]; used: UsedAddress[] }> {
    const status = this.store.status();
    if (!status.exists || !status.network) throw new Error("There is no wallet yet.");
    const hub = await this.hub();
    if (!hub.getHistory || !hub.getTransactions) throw new Error("This wallet server cannot list transactions.");

    const used = (await this.scanChain(0, RECEIVING_GAP))
      .concat(await this.scanChain(1, CHANGE_GAP))
      .filter((a) => a.used);
    const txids = new Set<string>();
    for (const a of used) (await hub.getHistory(a.address)).forEach((h) => txids.add(h.txid));
    // Array.from, not spread: the app's Babel setup is loose, and spreading a Set gives [set].
    const ids = Array.from(txids);
    const fetched = await hub.getTransactions(ids);
    const missing = ids.filter((id) => !fetched.has(id));
    // A balance computed from some of the transactions would be wrong, so say so instead.
    if (missing.length) throw new Error(`The wallet server did not return ${missing.length} of the transactions.`);

    const outputs = unspentOutputs(
      Array.from(fetched.values()),
      new Set(used.map((a) => a.address)),
      getNetwork(status.network)
    );
    return { outputs, used };
  }

  private sending: Promise<unknown> = Promise.resolve();
  private pendingSpends = new Map<string, number>();

  /**
   * lbry-sdk's wallet_send for one address: pays `amount` (a decimal string of LBC), takes the fee from the
   * wallet's own coins and sends the change to a fresh change address. The wallet must be unlocked. Only plain
   * coins are spent, never ones holding a claim or a support. One payment is worked out at a time, so two cannot
   * pick the same coins.
   */
  send(params: { addresses?: string[]; amount?: string }): Promise<{ txid: string; fee: string; amount: string }> {
    const run = () => this.build(params);
    const result = this.sending.then(run, run);
    this.sending = result.catch(() => undefined);
    return result;
  }

  private async build(params: { addresses?: string[]; amount?: string }) {
    const status = this.store.status();
    if (!status.exists || !status.network) throw new Error("There is no wallet yet.");
    const network = getNetwork(status.network);

    if (!Array.isArray(params.addresses) || params.addresses.length !== 1) {
      throw new Error("Send to exactly one address.");
    }
    const address = params.addresses[0];
    if (typeof address !== "string" || !isValidAddress(address, network))
      throw new Error("That is not a valid address.");
    const amount = parseDewies(params.amount);
    if (amount < DUST_DEWIES) throw new Error("That amount is too small to send.");
    // Checked before any network work, so a locked wallet fails fast and nothing is built.
    if (this.store.status().locked) throw new WalletLockedError();

    const hub = await this.hub();
    if (!hub.broadcast) throw new Error("This wallet server cannot send transactions.");
    const { outputs, used } = await this.ownedOutputs();
    const now = Date.now();
    this.pendingSpends.forEach((at, key) => now - at > PENDING_SPEND_MS && this.pendingSpends.delete(key));

    const spendable: Utxo[] = outputs
      .filter((o) => o.kind === "plain" && !this.pendingSpends.has(`${o.txid}:${o.vout}`))
      .map((o) => ({
        txid: o.txid,
        vout: o.vout,
        value: o.value,
        script: o.script,
        address: o.address,
        height: o.height,
      }));
    const where = new Map(used.map((a) => [a.address, a]));

    // A change address that has never been used.
    const changeAddress = (await this.scanChain(1, CHANGE_GAP)).find((a) => !a.used);
    if (!changeAddress) throw new Error("No unused change address was found.");

    let selection;
    try {
      selection = selectCoins(
        spendable,
        [{ script: addressToScript(address, network), value: amount }],
        addressToScript(changeAddress.address, network),
        DEFAULT_FEE_PER_BYTE
      );
    } catch (e) {
      if ((e as Error).name === "InsufficientFundsError") throw new Error("Not enough available Credits.");
      throw e;
    }
    if (selection.fee > MAX_FEE_DEWIES)
      throw new Error("The fee for this payment is unreasonably high, so it was not sent.");

    const payment = assembleTransaction(
      selection.inputs,
      [{ script: addressToScript(address, network), value: amount }],
      selection.change > 0n
        ? { script: addressToScript(changeAddress.address, network), value: selection.change }
        : undefined
    );
    const signed = this.store.withKeys((keyFor) =>
      signTransaction(payment, (utxo) => {
        const owner = where.get(utxo.address);
        if (!owner) throw new Error("A coin to spend does not belong to this wallet.");
        return keyFor(owner.chain, owner.index);
      })
    );

    const sentId = await hub.broadcast(signed.toHex());
    if (sentId && sentId !== signed.txid) throw new Error("The wallet server reported a different transaction.");
    selection.inputs.forEach((u) => this.pendingSpends.set(`${u.txid}:${u.vout}`, Date.now()));
    this.balanceCache = null;
    return { txid: signed.txid, fee: dewiesToString(selection.fee), amount: dewiesToString(amount) };
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

const DUST_DEWIES = 1000n;

/** "1.5" to dewies, exactly: no floats, at most 8 decimals, nothing but digits. */
export function parseDewies(value: unknown): bigint {
  if (typeof value !== "string" || !/^\d+(\.\d{1,8})?$/.test(value)) throw new Error("That is not a valid amount.");
  const [whole, fraction = ""] = value.split(".");
  return BigInt(whole) * 100_000_000n + BigInt(fraction.padEnd(8, "0"));
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
