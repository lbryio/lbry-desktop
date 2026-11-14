// Ported from lBC-wallet-with-mining-ability packages/core/test/vault.test.ts @ 93e19c1 (vitest -> Jest).
import {
  openJson,
  openWithKey,
  passwordStrength,
  sealJson,
  sealWithKey,
  WrongPasswordError,
} from "../../../extras/lbc/vault.js";
import { randomBytes } from "../../../extras/lbc/crypto/hash.js";

const FAST = { N: 1 << 10, r: 8, p: 1 };

describe("vault", () => {
  it("encrypts and decrypts JSON with a password", async () => {
    const box = await sealJson({ mnemonic: "abandon ability" }, "correct horse", "seed", FAST);
    expect(box.ciphertext).not.toContain("abandon");
    expect(await openJson(box, "correct horse", "seed")).toEqual({ mnemonic: "abandon ability" });
  });

  it("rejects a wrong password, wrong purpose, or tampered ciphertext", async () => {
    const box = await sealJson({ a: 1 }, "pw-one", "seed", FAST);
    await expect(openJson(box, "pw-two", "seed")).rejects.toBeInstanceOf(WrongPasswordError);
    await expect(openJson(box, "pw-one", "state")).rejects.toBeInstanceOf(WrongPasswordError);
    const flipped = { ...box, ciphertext: (box.ciphertext[0] === "a" ? "b" : "a") + box.ciphertext.slice(1) };
    await expect(openJson(flipped, "pw-one", "seed")).rejects.toBeInstanceOf(WrongPasswordError);
  });

  it("uses a fresh salt and nonce every time", async () => {
    const a = await sealJson({ a: 1 }, "pw", "seed", FAST);
    const b = await sealJson({ a: 1 }, "pw", "seed", FAST);
    expect(a.kdf!.salt).not.toBe(b.kdf!.salt);
    expect(a.cipher.nonce).not.toBe(b.cipher.nonce);
  });

  it("supports raw-key boxes for bulk wallet state", () => {
    const key = randomBytes(32);
    const box = sealWithKey(new TextEncoder().encode("state"), key, "state");
    expect(new TextDecoder().decode(openWithKey(box, key, "state"))).toBe("state");
    expect(() => openWithKey(box, randomBytes(32), "state")).toThrow(WrongPasswordError);
  });

  it("scores password strength", () => {
    expect(passwordStrength("short").score).toBe(0);
    expect(passwordStrength("password123").score).toBeLessThanOrEqual(1);
    expect(passwordStrength("correct horse battery staple").score).toBeGreaterThanOrEqual(3);
  });
});
