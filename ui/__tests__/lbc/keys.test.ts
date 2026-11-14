// Ported from lBC-wallet-with-mining-ability packages/core/test/keys.test.ts @ 93e19c1 (vitest -> Jest).
import { HDKey } from "@scure/bip32";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { MAINNET } from "../../../extras/lbc/networks.js";
import { fromHex, toHex } from "../../../extras/lbc/encoding/bytes.js";
import {
  addressFromPublicKey,
  decodeAddress,
  isValidAddress,
  addressToScript,
  scriptToAddress,
  encodeWif,
  decodeWif,
} from "../../../extras/lbc/address.js";
import {
  bip39Seed,
  checkPhrase,
  generateMnemonic,
  isValidBip39,
  lbryMnemonicToSeed,
  lbrySeed,
  normalizeLbryText,
} from "../../../extras/lbc/keys/mnemonic.js";
import {
  AddressDeriver,
  deriveAccountKey,
  derivePrivateKey,
  publicOnly,
  versionsFor,
} from "../../../extras/lbc/keys/hd.js";

// Vectors from lbry-sdk tests/unit/wallet/test_account.py, test_bip32.py, test_mnemonic.py
const LBRY_SEED = "carbon smart garage balance margin twelve chest sword toast envelope bottom stomach absent";
const LBRY_XPRV =
  "xprv9s21ZrQH143K42ovpZygnjfHdAqSd9jo7zceDfPRogM7bkkoNVv7DRNLEoB8HoirMgH969NrgL8jNzLEegqFzPRWM37GXd4uE8uuRkx4LAe";
const LBRY_XPUB =
  "xpub661MyMwAqRbcGWtPvbWh9sc2BCfw2cTeVDYF23o3N1t6UZ5wv3EMmDgp66FxHuDtWdft3B5eL5xQtyzAtkdmhhC95gjRjLzSTdkho95asu9";
const LBRY_FIRST_ADDRESS = "bCqJrLHdoiRqEZ1whFZ3WHNb33bP34SuGx";
const LBRY_FIRST_KEY_XPRV =
  "xprv9vwXVierUTT4hmoe3dtTeBfbNv1ph2mm8RWXARU6HsZjBaAoFaS2FRQu4fptRAyJWhJW42dmsEaC1nKnVKKTMhq3TVEHsNj1ca3ciZMKktT";

describe("LBRY SDK compatibility", () => {
  it("derives the seed exactly like lbry-sdk Mnemonic.mnemonic_to_seed", () => {
    expect(toHex(lbryMnemonicToSeed("foobar", "torba"))).toBe(
      "475a419db4e991cab14f08bde2d357e52b3e7241f72c6d8a2f92782367feeee9f403dc6a37c26a3f02ab9dec7f5063161eb139cea00da64cd77fba2f07c49ddc"
    );
  });

  it("restores the LBRY account master key and first address from a LBRY seed phrase", () => {
    const account = deriveAccountKey(LBRY_SEED, "lbry", MAINNET);
    expect(account.privateExtendedKey).toBe(LBRY_XPRV);
    expect(account.publicExtendedKey).toBe(LBRY_XPUB);
    const deriver = new AddressDeriver(publicOnly(account, MAINNET), MAINNET);
    expect(deriver.derive(0, 0).address).toBe(LBRY_FIRST_ADDRESS);
    // The private key lbry-sdk returns for that address is m/0/0.
    const child = account.deriveChild(0).deriveChild(0);
    expect(child.privateExtendedKey).toBe(LBRY_FIRST_KEY_XPRV);
    expect(toHex(derivePrivateKey(account, 0, 0))).toBe(toHex(child.privateKey!));
  });

  it("normalises LBRY seed text (case, whitespace, accents)", () => {
    expect(normalizeLbryText("  Carbon   SMART\tgarage ")).toBe("carbon smart garage");
    expect(normalizeLbryText("café")).toBe("cafe");
    expect(
      toHex(lbrySeed("CARBON smart  garage balance margin twelve chest sword toast envelope bottom stomach absent"))
    ).toBe(toHex(lbrySeed(LBRY_SEED)));
  });

  it("computes P2PKH addresses with the LBC prefix (lbry-sdk bip32 test)", () => {
    const priv = fromHex("2423f3dc6087d9683f73a684935abc0ccd8bc26370588f56653128c6a6f0bf7c");
    const pub = secp256k1.getPublicKey(priv, true);
    expect(addressFromPublicKey(pub, MAINNET)).toBe("bUDcmraBp2zCV3QWmVVeQaEgepbs1b2gC9");
  });

  it("accepts the extended keys from lbry-sdk test_from_extended_keys", () => {
    const versions = versionsFor(MAINNET);
    expect(() =>
      HDKey.fromExtendedKey(
        "xprv9s21ZrQH143K2dyhK7SevfRG72bYDRNv25yKPWWm6dqApNxm1Zb1m5gGcBWYfbsPjTr2v5joit8Af2Zp5P6yz3jMbycrLrRMpeAJxR8qDg8",
        versions
      )
    ).not.toThrow();
    expect(() =>
      HDKey.fromExtendedKey(
        "xpub661MyMwAqRbcF84AR8yfHoMzf4S2ct6mPJtvBtvNeyN9hBHuZ6uGJszkTSn5fQUCdz3XU17eBzFeAUwV6fiW44g14WF52fYC5J483wqQ5ZP",
        versions
      )
    ).not.toThrow();
  });
});

describe("BIP39 / BIP44", () => {
  it("matches the BIP39 reference vector", () => {
    const phrase = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
    expect(isValidBip39(phrase)).toBe(true);
    expect(toHex(bip39Seed(phrase, "TREZOR"))).toBe(
      "c55257c360c07c72029aebc1b53c05ed0362ada38ead3e3e9efa3708e53495531f09a6987599d18264c1e1c92f2cf141630c7a3c4ab7c81b2f001698e7463b04"
    );
  });

  it("generates checksum-valid 12 and 24 word phrases", () => {
    const p12 = generateMnemonic(12);
    const p24 = generateMnemonic(24);
    expect(p12.split(" ")).toHaveLength(12);
    expect(p24.split(" ")).toHaveLength(24);
    expect(isValidBip39(p12)).toBe(true);
    expect(isValidBip39(p24)).toBe(true);
    expect(generateMnemonic()).not.toBe(p12);
  });

  it("reports unknown words and checksum failures", () => {
    const c = checkPhrase(
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon zzzz"
    );
    expect(c.unknownWords).toEqual(["zzzz"]);
    expect(c.bip39Valid).toBe(false);
    expect(
      checkPhrase("abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon")
        .bip39Valid
    ).toBe(false);
    expect(
      checkPhrase(" Abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon ABOUT ")
        .bip39Valid
    ).toBe(true);
  });

  it("derives m/44'/140'/0' (SLIP-44 coin type 140)", () => {
    const phrase = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
    const account = deriveAccountKey(phrase, "bip44", MAINNET);
    const root = HDKey.fromMasterSeed(bip39Seed(phrase), versionsFor(MAINNET));
    expect(account.publicExtendedKey).toBe(root.derive("m/44'/140'/0'").publicExtendedKey);
    expect(account.depth).toBe(3);
    const deriver = new AddressDeriver(publicOnly(account, MAINNET), MAINNET);
    const first = deriver.derive(0, 0).address;
    expect(first.startsWith("b")).toBe(true);
    expect(first).toBe(addressFromPublicKey(root.derive("m/44'/140'/0'/0/0").publicKey!, MAINNET));
    // Passphrase changes everything
    const withPass = deriveAccountKey(phrase, "bip44", MAINNET, { passphrase: "x" });
    expect(withPass.publicExtendedKey).not.toBe(account.publicExtendedKey);
  });
});

describe("addresses", () => {
  it("round-trips P2PKH and P2SH addresses through scripts", () => {
    const p2pkh = decodeAddress(LBRY_FIRST_ADDRESS, MAINNET);
    expect(p2pkh.type).toBe("p2pkh");
    expect(scriptToAddress(addressToScript(LBRY_FIRST_ADDRESS, MAINNET), MAINNET)).toBe(LBRY_FIRST_ADDRESS);
    // P2SH addresses use version byte 0x7a and therefore start with "r".
    const p2sh = scriptToAddress(new Uint8Array([0xa9, 0x14, ...new Uint8Array(20).fill(7), 0x87]), MAINNET)!;
    expect(p2sh.startsWith("r")).toBe(true);
    expect(decodeAddress(p2sh, MAINNET).type).toBe("p2sh");
  });

  it("rejects addresses from other networks or with typos", () => {
    expect(isValidAddress(LBRY_FIRST_ADDRESS, MAINNET)).toBe(true);
    expect(isValidAddress(LBRY_FIRST_ADDRESS.slice(0, -1) + "y", MAINNET)).toBe(false);
    expect(isValidAddress("1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2", MAINNET)).toBe(false); // bitcoin
    expect(isValidAddress("", MAINNET)).toBe(false);
  });

  it("encodes and validates native segwit addresses with the lbc hrp", () => {
    const program = fromHex("751e76e8199196d454941c45d1b3a323f1433bd6");
    const script = new Uint8Array([0x00, 0x14, ...program]);
    const addr = scriptToAddress(script, MAINNET)!;
    expect(addr.startsWith("lbc1q")).toBe(true);
    expect(decodeAddress(addr, MAINNET).type).toBe("p2wpkh");
    expect(toHex(addressToScript(addr, MAINNET))).toBe(toHex(script));
  });

  it("round-trips WIF keys", () => {
    const priv = fromHex("2423f3dc6087d9683f73a684935abc0ccd8bc26370588f56653128c6a6f0bf7c");
    const wif = encodeWif(priv, MAINNET);
    const back = decodeWif(wif, MAINNET);
    expect(back.compressed).toBe(true);
    expect(toHex(back.privateKey)).toBe(toHex(priv));
  });
});
