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
