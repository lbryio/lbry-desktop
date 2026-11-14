import fs from "fs";
import os from "os";
import path from "path";
import { WalletError, WalletStore, WrongPasswordError } from "../../../electron/wallet/store";

// The seed, first address and xprv/xpub below are from lbry-sdk's own tests (see ui/__tests__/lbc/keys.test.ts).
const LBRY_SEED = "carbon smart garage balance margin twelve chest sword toast envelope bottom stomach absent";
const LBRY_XPUB =
  "xpub661MyMwAqRbcGWtPvbWh9sc2BCfw2cTeVDYF23o3N1t6UZ5wv3EMmDgp66FxHuDtWdft3B5eL5xQtyzAtkdmhhC95gjRjLzSTdkho95asu9";
const LBRY_FIRST_ADDRESS = "bCqJrLHdoiRqEZ1whFZ3WHNb33bP34SuGx";
const BIP39_PHRASE = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
const FAST = { N: 1 << 10, r: 8, p: 1 };
const PASSWORD = "correct horse battery";

let dir: string;
const makeStore = (d = dir) => new WalletStore(d, { kdfCost: FAST });
const walletFile = () => path.join(dir, "wallet.json");

function expectNoPlainTextPhrase(onDisk: string, phrase: string) {
  const words = phrase.split(" ");
  expect(onDisk).not.toContain(phrase);
  for (let i = 0; i + 1 < words.length; i++) expect(onDisk).not.toContain(`${words[i]} ${words[i + 1]}`);
  // And no string value in the parsed file contains it either.
  const values: string[] = [];
  JSON.stringify(JSON.parse(onDisk), (key, value) => (typeof value === "string" && values.push(value), value));
  values.forEach((value) => expect(value).not.toContain(words[0] + " " + words[1]));
}

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "lbry-wallet-test-"));
});
afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

describe("WalletStore", () => {
  it("has no wallet to begin with", () => {
    expect(makeStore().status()).toEqual({ exists: false, locked: true });
  });

  it("creates a wallet, returns the new phrase once and never stores it in plain text", async () => {
    const store = makeStore();
    const created = await store.create({ password: PASSWORD, name: "Main" });
    expect(created.mnemonic.split(" ")).toHaveLength(12);
    expect(created).toMatchObject({ exists: true, locked: true, name: "Main", scheme: "lbry", network: "mainnet" });
    expect(created.xpub).toMatch(/^xpub/);

    expectNoPlainTextPhrase(fs.readFileSync(walletFile(), "utf8"), created.mnemonic);
    expect(JSON.parse(fs.readFileSync(walletFile(), "utf8")).xpub).toBe(created.xpub);
    expect(fs.readFileSync(walletFile(), "utf8")).not.toContain(PASSWORD);
  });

  // Several BIP39 words are also keys in wallet.json ("version", "secret", "name", "salt", ...), so a single
  // word showing up proves nothing. Two consecutive words, or the whole phrase, would.
  it("is not fooled by a phrase made of the file's own key names", async () => {
    const store = makeStore();
    const phrase = "version secret name salt scheme network format version secret name salt scheme";
    await store.import({ password: PASSWORD, mnemonic: phrase });
    const onDisk = fs.readFileSync(walletFile(), "utf8");
    expect(onDisk).toContain('"version"'); // the words really are in the file, as keys
    expectNoPlainTextPhrase(onDisk, phrase);
  });

  it("can make a 24 word phrase", async () => {
    const created = await makeStore().create({ password: PASSWORD, words: 24 });
    expect(created.mnemonic.split(" ")).toHaveLength(24);
  });

  it("writes the file readable by its owner only", async () => {
    await makeStore().create({ password: PASSWORD });
    if (process.platform !== "win32") {
      expect(fs.statSync(walletFile()).mode & 0o777).toBe(0o600);
      expect(fs.statSync(dir).mode & 0o777).toBe(0o700);
    }
    expect(fs.readdirSync(dir)).toEqual(["wallet.json"]); // no temporary file left behind
  });

  it("imports a LBRY SDK phrase and gets the SDK's keys and first address", async () => {
    const store = makeStore();
    const status = await store.import({ password: PASSWORD, mnemonic: LBRY_SEED });
    expect(status.xpub).toBe(LBRY_XPUB);
    expect(store.addresses(0, 0, 1)).toEqual([{ address: LBRY_FIRST_ADDRESS, chain: 0, index: 0 }]);
  });

  it("tidies a pasted phrase", async () => {
    const status = await makeStore().import({
      password: PASSWORD,
      mnemonic: `  ${LBRY_SEED.toUpperCase().replace(/ /g, "   ")} \n`,
    });
    expect(status.xpub).toBe(LBRY_XPUB);
  });

  it("imports a BIP39 phrase with the bip44 scheme and rejects a bad checksum", async () => {
    const store = makeStore();
    const status = await store.import({ password: PASSWORD, mnemonic: BIP39_PHRASE, scheme: "bip44" });
    expect(status.scheme).toBe("bip44");
    expect(store.addresses(0, 0, 1)[0].address.startsWith("b")).toBe(true);

    const other = makeStore(fs.mkdtempSync(path.join(os.tmpdir(), "lbry-wallet-test-")));
    await expect(
      other.import({ password: PASSWORD, mnemonic: BIP39_PHRASE.replace("about", "abandon"), scheme: "bip44" })
    ).rejects.toThrow(/checksum/);
  });

  it("derives receiving and change addresses while locked", async () => {
    const store = makeStore();
    await store.import({ password: PASSWORD, mnemonic: LBRY_SEED });
    expect(store.status().locked).toBe(true);
    const receiving = store.addresses(0, 0, 5);
    const change = store.addresses(1, 0, 2);
    expect(receiving).toHaveLength(5);
    expect(new Set(receiving.concat(change).map((a) => a.address)).size).toBe(7);
    expect(store.addresses(0, 3, 2)).toEqual(receiving.slice(3, 5));
  });

  it("rejects bad address requests", async () => {
    const store = makeStore();
    await store.import({ password: PASSWORD, mnemonic: LBRY_SEED });
    expect(() => store.addresses(2, 0, 1)).toThrow(WalletError);
    expect(() => store.addresses(0, -1, 1)).toThrow(WalletError);
    expect(() => store.addresses(0, 0, 501)).toThrow(WalletError);
    expect(() => makeStore(fs.mkdtempSync(path.join(os.tmpdir(), "lbry-wallet-test-"))).addresses(0, 0, 1)).toThrow(
      /no wallet/
    );
  });

  it("unlocks with the right password and locks again", async () => {
    const store = makeStore();
    await store.import({ password: PASSWORD, mnemonic: LBRY_SEED });
    await expect(store.unlock("not the password")).rejects.toBeInstanceOf(WrongPasswordError);
    expect(store.status().locked).toBe(true);

    expect((await store.unlock(PASSWORD)).locked).toBe(false);
    expect(store.lock().locked).toBe(true);
  });

  it("unlock state does not survive a new store (an app restart)", async () => {
    await makeStore().import({ password: PASSWORD, mnemonic: LBRY_SEED });
    const first = makeStore();
    await first.unlock(PASSWORD);
    expect(makeStore().status().locked).toBe(true);
  });

  describe("auto-lock", () => {
    afterEach(() => jest.useRealTimers());

    it("locks itself after the idle time and says so", async () => {
      const store = new WalletStore(dir, { kdfCost: FAST, autoLockMs: 60_000 });
      await store.import({ password: PASSWORD, mnemonic: LBRY_SEED });
      const seen: boolean[] = [];
      store.onLockChange((status) => seen.push(status.locked));

      jest.useFakeTimers();
      await store.unlock(PASSWORD);
      expect(store.status().locked).toBe(false);
      expect(store.status().autoLockAt).toBeGreaterThan(Date.now());

      jest.advanceTimersByTime(59_000);
      expect(store.status().locked).toBe(false);
      jest.advanceTimersByTime(2_000);
      expect(store.status().locked).toBe(true);
      expect(store.status().autoLockAt).toBeUndefined();
      expect(seen).toEqual([false, true]);
    });

    it("touch() restarts the countdown", async () => {
      const store = new WalletStore(dir, { kdfCost: FAST, autoLockMs: 60_000 });
      await store.import({ password: PASSWORD, mnemonic: LBRY_SEED });
      jest.useFakeTimers();
      await store.unlock(PASSWORD);

      jest.advanceTimersByTime(50_000);
      store.touch();
      jest.advanceTimersByTime(50_000);
      expect(store.status().locked).toBe(false);
      jest.advanceTimersByTime(11_000);
      expect(store.status().locked).toBe(true);
    });

    it("tells listeners once for a manual lock, and not at all if already locked", async () => {
      const store = makeStore();
      await store.import({ password: PASSWORD, mnemonic: LBRY_SEED });
      const seen: boolean[] = [];
      const stop = store.onLockChange((status) => seen.push(status.locked));

      store.lock();
      expect(seen).toEqual([]);
      await store.unlock(PASSWORD);
      store.lock();
      store.lock();
      expect(seen).toEqual([false, true]);

      stop();
      await store.unlock(PASSWORD);
      expect(seen).toEqual([false, true]);
    });

    it("can be turned off", async () => {
      const store = new WalletStore(dir, { kdfCost: FAST, autoLockMs: 0 });
      await store.import({ password: PASSWORD, mnemonic: LBRY_SEED });
      jest.useFakeTimers();
      await store.unlock(PASSWORD);
      jest.advanceTimersByTime(24 * 60 * 60 * 1000);
      expect(store.status().locked).toBe(false);
      expect(store.status().autoLockAt).toBeUndefined();
    });

    it("a listener that throws does not stop the lock or the others", async () => {
      const store = makeStore();
      await store.import({ password: PASSWORD, mnemonic: LBRY_SEED });
      const seen: boolean[] = [];
      store.onLockChange(() => {
        throw new Error("boom");
      });
      store.onLockChange((status) => seen.push(status.locked));
      await store.unlock(PASSWORD);
      expect(store.lock().locked).toBe(true);
      expect(seen).toEqual([false, true]);
    });
  });

  it("reveals the phrase only for the right password", async () => {
    const store = makeStore();
    await store.import({ password: PASSWORD, mnemonic: LBRY_SEED });
    await expect(store.reveal("wrong password")).rejects.toBeInstanceOf(WrongPasswordError);
    expect(await store.reveal(PASSWORD)).toMatchObject({ mnemonic: LBRY_SEED, scheme: "lbry" });
  });

  it("changes the password", async () => {
    const store = makeStore();
    await store.import({ password: PASSWORD, mnemonic: LBRY_SEED });
    await expect(store.changePassword("wrong password", "another long one")).rejects.toBeInstanceOf(WrongPasswordError);
    await expect(store.changePassword(PASSWORD, "short")).rejects.toThrow(/at least 8/);
    await store.changePassword(PASSWORD, "another long one");
    await expect(store.unlock(PASSWORD)).rejects.toBeInstanceOf(WrongPasswordError);
    expect((await store.unlock("another long one")).locked).toBe(false);
    expect((await store.reveal("another long one")).mnemonic).toBe(LBRY_SEED);
  });

  it("insists on a password and a real phrase", async () => {
    const store = makeStore();
    await expect(store.create({ password: "short" })).rejects.toThrow(/at least 8/);
    await expect(store.import({ password: PASSWORD, mnemonic: "too few words here" })).rejects.toThrow(/12 words/);
    await expect(store.import({ password: PASSWORD, mnemonic: LBRY_SEED, scheme: "nope" as any })).rejects.toThrow(
      /scheme/
    );
    expect(fs.existsSync(walletFile())).toBe(false);
  });

  it("never replaces an existing wallet", async () => {
    const store = makeStore();
    await store.import({ password: PASSWORD, mnemonic: LBRY_SEED });
    const before = fs.readFileSync(walletFile(), "utf8");
    await expect(store.create({ password: PASSWORD })).rejects.toThrow(/already exists/);
    await expect(store.import({ password: PASSWORD, mnemonic: BIP39_PHRASE })).rejects.toThrow(/already exists/);
    expect(fs.readFileSync(walletFile(), "utf8")).toBe(before);
  });

  it("two creates at once make one wallet", async () => {
    const store = makeStore();
    const results = await Promise.allSettled([
      store.create({ password: PASSWORD }),
      store.create({ password: PASSWORD }),
    ]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    expect(results.filter((r) => r.status === "rejected")).toHaveLength(1);
  });

  it("reports a damaged file without touching it, and will not overwrite it", async () => {
    fs.writeFileSync(walletFile(), "{ not json");
    const store = makeStore();
    expect(store.status()).toMatchObject({
      exists: true,
      locked: true,
      error: expect.stringMatching(/not valid JSON/),
    });
    await expect(store.create({ password: PASSWORD })).rejects.toThrow(/cannot be read/);
    await expect(store.unlock(PASSWORD)).rejects.toThrow(/not valid JSON/);
    expect(fs.readFileSync(walletFile(), "utf8")).toBe("{ not json");

    fs.writeFileSync(walletFile(), JSON.stringify({ format: "something-else" }));
    expect(makeStore().status().error).toMatch(/not a LBRY Desktop wallet/);
  });

  it("detects a file whose public key was swapped", async () => {
    const store = makeStore();
    await store.import({ password: PASSWORD, mnemonic: LBRY_SEED });
    const file = JSON.parse(fs.readFileSync(walletFile(), "utf8"));
    const other = makeStore(fs.mkdtempSync(path.join(os.tmpdir(), "lbry-wallet-test-")));
    file.xpub = (await other.import({ password: PASSWORD, mnemonic: BIP39_PHRASE })).xpub;
    fs.writeFileSync(walletFile(), JSON.stringify(file));
    await expect(makeStore().unlock(PASSWORD)).rejects.toThrow(/do not match/);
  });
});

// An existing lbrynet wallet is only ever read. These are temporary files shaped like the SDK's, never the real one.
describe("WalletStore: bringing in an existing lbrynet wallet", () => {
  let sdkDir: string;
  let sdkFile: string;

  const writeSdkWallet = (accounts: Array<Record<string, unknown>>, name = "My Wallet") =>
    fs.writeFileSync(sdkFile, JSON.stringify({ version: 1, name, accounts, preferences: {} }));
  const storeWithSdk = (files = [sdkFile]) => new WalletStore(dir, { kdfCost: FAST, lbrynetFiles: files });
  const account = (extra: Record<string, unknown> = {}) => ({
    name: "acct",
    encrypted: false,
    seed: LBRY_SEED,
    private_key: "xprv-not-checked",
    public_key: LBRY_XPUB,
    ...extra,
  });

  beforeEach(() => {
    sdkDir = fs.mkdtempSync(path.join(os.tmpdir(), "lbry-sdk-wallet-"));
    sdkFile = path.join(sdkDir, "default_wallet");
  });
  afterEach(() => fs.rmSync(sdkDir, { recursive: true, force: true }));

  it("reports no wallet, and never the phrase", () => {
    expect(storeWithSdk().findLbrynet()).toEqual({ found: false });
    writeSdkWallet([account()], "Old wallet");
    const found = storeWithSdk().findLbrynet();
    expect(found).toEqual({ found: true, path: sdkFile, name: "Old wallet", encrypted: false });
    expect(JSON.stringify(found)).not.toContain("carbon");
  });

  it("flags a password-protected wallet", () => {
    writeSdkWallet([account({ encrypted: true })]);
    expect(storeWithSdk().findLbrynet()).toMatchObject({ found: true, encrypted: true });
  });

  it("reports a damaged file without throwing", () => {
    fs.writeFileSync(sdkFile, "{ not json");
    expect(storeWithSdk().findLbrynet()).toMatchObject({
      found: false,
      error: expect.stringMatching(/Could not read/),
    });
  });

  it("creates the app wallet from it with the SDK's keys, and leaves the original untouched", async () => {
    writeSdkWallet([account()], "Old wallet");
    const before = fs.readFileSync(sdkFile, "utf8");
    const store = storeWithSdk();

    const status = await store.importLbrynet(PASSWORD);
    expect(status).toMatchObject({ exists: true, name: "Old wallet", scheme: "lbry", xpub: LBRY_XPUB });
    expect(store.addresses(0, 0, 1)[0].address).toBe(LBRY_FIRST_ADDRESS);
    expect((await store.reveal(PASSWORD)).mnemonic).toBe(LBRY_SEED);
    expect(fs.readFileSync(sdkFile, "utf8")).toBe(before);
    expect(fs.readFileSync(walletFile(), "utf8")).not.toContain(LBRY_SEED);
  });

  it("refuses when the phrase does not give the file's public key, and writes nothing", async () => {
    writeSdkWallet([account({ public_key: "xpub-of-some-other-wallet" })]);
    await expect(storeWithSdk().importLbrynet(PASSWORD)).rejects.toThrow(/does not match its public key/);
    expect(fs.existsSync(walletFile())).toBe(false);
  });

  it("refuses an encrypted wallet and says what to do", async () => {
    writeSdkWallet([account({ encrypted: true })]);
    await expect(storeWithSdk().importLbrynet(PASSWORD)).rejects.toThrow(/recovery phrase instead/);
    expect(fs.existsSync(walletFile())).toBe(false);
  });

  it("refuses when there is no wallet, no account or no seed", async () => {
    await expect(storeWithSdk().importLbrynet(PASSWORD)).rejects.toThrow(/No LBRY wallet was found/);
    writeSdkWallet([]);
    await expect(storeWithSdk().importLbrynet(PASSWORD)).rejects.toThrow(/no account/);
    writeSdkWallet([account({ seed: undefined })]);
    await expect(storeWithSdk().importLbrynet(PASSWORD)).rejects.toThrow(/protected with a password/);
  });

  it("still enforces the password rules and never replaces an existing wallet", async () => {
    writeSdkWallet([account()]);
    const store = storeWithSdk();
    await expect(store.importLbrynet("short")).rejects.toThrow(/at least 8/);
    await store.importLbrynet(PASSWORD);
    await expect(store.importLbrynet(PASSWORD)).rejects.toThrow(/already exists/);
  });

  it("uses the first candidate file that exists", () => {
    writeSdkWallet([account()], "Second place");
    const missing = path.join(sdkDir, "nowhere", "default_wallet");
    expect(storeWithSdk([missing, sdkFile]).findLbrynet()).toMatchObject({ found: true, name: "Second place" });
  });
});
