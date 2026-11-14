import fs from "fs";
import os from "os";
import path from "path";
import { paginate, WalletService, type AddressStatusSource } from "../../../electron/wallet/service";
import { WalletStore } from "../../../electron/wallet/store";

// lbry-sdk's test seed: its xpub and first address are checked in ui/__tests__/lbc/keys.test.ts.
const SEED = "carbon smart garage balance margin twelve chest sword toast envelope bottom stomach absent";
const XPUB =
  "xpub661MyMwAqRbcGWtPvbWh9sc2BCfw2cTeVDYF23o3N1t6UZ5wv3EMmDgp66FxHuDtWdft3B5eL5xQtyzAtkdmhhC95gjRjLzSTdkho95asu9";
const FIRST = "bCqJrLHdoiRqEZ1whFZ3WHNb33bP34SuGx";
const FAST = { N: 1 << 10, r: 8, p: 1 };

let dir: string;
beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "lbry-wallet-service-"));
});
afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

/** A hub where the addresses in `used` have history; everything else has none. */
function fakeHub(store: WalletStore, used: Array<[number, number]>, empty: string | null = null) {
  const usedAddresses = new Set(used.map(([chain, index]) => store.addresses(chain, index, 1)[0].address));
  const asked: string[][] = [];
  const hub: AddressStatusSource = {
    subscribeAddresses: async (addresses) => {
      asked.push(addresses);
      return addresses.map((a) => (usedAddresses.has(a) ? "deadbeef" : empty));
    },
  };
  return { hub, asked };
}

async function setup(used: Array<[number, number]> = [], empty: string | null = null) {
  const store = new WalletStore(dir, { kdfCost: FAST });
  await store.import({ password: "correct horse", mnemonic: SEED });
  const { hub, asked } = fakeHub(store, used, empty);
  let connects = 0;
  const service = new WalletService(store, async () => {
    connects++;
    return hub;
  });
  return { store, service, asked, connects: () => connects };
}

describe("WalletService.addressUnused", () => {
  it("returns the first receiving address when nothing has been used", async () => {
    const { service } = await setup();
    expect(await service.addressUnused()).toBe(FIRST);
  });

  it("skips used addresses", async () => {
    const { service, store } = await setup([
      [0, 0],
      [0, 1],
    ]);
    expect(await service.addressUnused()).toBe(store.addresses(0, 2, 1)[0].address);
  });

  it("ignores used change addresses", async () => {
    const { service } = await setup([[1, 0]]);
    expect(await service.addressUnused()).toBe(FIRST);
  });

  it("finds an unused address beyond the first batch of 20", async () => {
    const used: Array<[number, number]> = [];
    for (let i = 0; i < 25; i++) used.push([0, i]);
    const { service, store } = await setup(used);
    expect(await service.addressUnused()).toBe(store.addresses(0, 25, 1)[0].address);
  });

  it("gives a different address than the excluded one, so Get New Address does something", async () => {
    const { service, store } = await setup();
    expect(await service.addressUnused({ exclude: FIRST })).toBe(store.addresses(0, 1, 1)[0].address);
    expect(await service.addressUnused({ exclude: "something else" })).toBe(FIRST);
  });

  it("never goes past the gap after the last used address", async () => {
    const { service, store } = await setup([[0, 0]]);
    // Used: 0. The window is 1..20; excluding the last of it must not run on to 21.
    const last = store.addresses(0, 20, 1)[0].address;
    expect(await service.addressUnused({ exclude: last })).toBe(store.addresses(0, 1, 1)[0].address);
    const results = new Set<string>();
    for (let i = 1; i <= 25; i++)
      results.add(await service.addressUnused({ exclude: store.addresses(0, i, 1)[0].address }));
    results.forEach((address) => expect(store.addresses(0, 21, 5).map((a) => a.address)).not.toContain(address));
  });

  it("treats an empty-string status (herald.go) like null", async () => {
    const { service } = await setup([], "");
    expect(await service.addressUnused()).toBe(FIRST);
  });

  it("connects to the hub once, and again after a failed connect", async () => {
    const store = new WalletStore(dir, { kdfCost: FAST });
    await store.import({ password: "correct horse", mnemonic: SEED });
    const { hub } = fakeHub(store, []);
    let attempts = 0;
    const service = new WalletService(store, async () => {
      attempts++;
      if (attempts === 1) throw new Error("no hub");
      return hub;
    });
    await expect(service.addressUnused()).rejects.toThrow("no hub");
    expect(await service.addressUnused()).toBe(FIRST);
    await service.addressUnused();
    expect(attempts).toBe(2);
  });

  it("fails clearly when there is no wallet", async () => {
    const service = new WalletService(new WalletStore(dir, { kdfCost: FAST }), async () => ({
      subscribeAddresses: async () => [],
    }));
    await expect(service.addressUnused()).rejects.toThrow(/no wallet/);
  });
});

describe("WalletService.scanChain", () => {
  it("stops one gap after the last used address", async () => {
    const { service } = await setup([
      [0, 15],
      [0, 34],
    ]);
    const addresses = await service.scanChain(0, 20);
    // batches 0-19 (used at 15), 20-39 (used at 34), 40-59 (nothing, and 59-34 >= 20): stop
    expect(addresses).toHaveLength(60);
    expect(addresses.filter((a) => a.used).map((a) => a.index)).toEqual([15, 34]);
  });

  it("is one batch for an empty chain", async () => {
    const { service, asked } = await setup();
    expect(await service.scanChain(1, 6)).toHaveLength(6);
    expect(asked).toHaveLength(1);
  });
});

describe("WalletService.addressList", () => {
  it("lists receiving then change addresses in the SDK's paginated shape", async () => {
    const { service, store } = await setup([[0, 0]]);
    const list = await service.addressList();
    // a used address at 0 means two receiving batches (0-19, 20-39), plus one change batch of 6
    expect(list).toMatchObject({ page: 1, page_size: 20, total_items: 46, total_pages: 3 });
    expect(list.items[0]).toMatchObject({ address: FIRST, used_times: 1, n: 0, chain: 0 });
    expect(list.items[1]).toMatchObject({ used_times: 0, n: 1 });
    expect(list.items.every((i) => i.account === service.account().id)).toBe(true);
    expect(store.addresses(0, 0, 1)[0].address).toBe(FIRST);
  });

  it("pages and filters by address", async () => {
    const { service, store } = await setup();
    const second = await service.addressList({ page: 2, page_size: 5 });
    expect(second.page).toBe(2);
    expect(second.items).toHaveLength(5);
    expect(second.items[0].n).toBe(5);
    const target = store.addresses(0, 3, 1)[0].address;
    const one = await service.addressList({ address: target });
    expect(one.items.map((i) => i.address)).toEqual([target]);
  });
});

describe("WalletService.account / accountList", () => {
  it("describes the account without a seed, and is named by its public key's address", async () => {
    const { service } = await setup();
    const account = service.account();
    expect(account).toMatchObject({
      name: "My Wallet",
      is_default: true,
      ledger: "lbc_mainnet",
      public_key: XPUB,
      address_generator: { receiving: { gap: 20 }, change: { gap: 6 } },
      locked: true,
    });
    expect(account.id).toMatch(/^b/);
    expect(account).not.toHaveProperty("seed");
    expect(JSON.stringify(account)).not.toContain("carbon");
  });

  it("answers both shapes the UI reads", async () => {
    const { service } = await setup();
    const result = service.accountList();
    expect(result.items).toHaveLength(1); // walletSeed
    expect(result.lbc_mainnet).toHaveLength(1); // sync.ts
    expect(result.lbc_mainnet[0].id).toBe(result.items[0].id);
    expect(result.lbc_testnet).toEqual([]);
  });

  it("reflects the lock state", async () => {
    const { service, store } = await setup();
    await store.unlock("correct horse");
    expect(service.account().locked).toBe(false);
  });
});

describe("paginate", () => {
  const items = Array.from({ length: 45 }, (_, i) => i);
  it("defaults page to 1 and page_size to 20 independently", () => {
    expect(paginate(items).items).toHaveLength(20);
    expect(paginate(items, undefined, 5).items).toEqual([0, 1, 2, 3, 4]);
    expect(paginate(items, 2).items[0]).toBe(20);
  });
  it("reports totals and caps the page size at 50", () => {
    expect(paginate(items, 3, 20)).toMatchObject({ items: [40, 41, 42, 43, 44], total_items: 45, total_pages: 3 });
    expect(paginate(items, 1, 500).page_size).toBe(50);
  });
  it("is empty past the end", () => {
    expect(paginate(items, 9, 20).items).toEqual([]);
  });
});
