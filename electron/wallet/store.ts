// The desktop wallet, kept in the Electron main process so the recovery phrase, the password check and the
// private keys never reach the renderer. Cryptography is the vendored extras/lbc code; this file only adds
// the file format, the lock state and the rules around them.
//
// File: <dir>/wallet.json (mode 0600, written atomically).
//   secret  the recovery phrase, sealed with the user's password (scrypt + AES-256-GCM, see extras/lbc/vault)
//   xpub    the account PUBLIC key, in the clear, so addresses and balances need no password (the lbry SDK
//           wallet file does the same)
//
// This is deliberately smaller than upstream's wallet/keystore.ts, which also carries atomic-swap and market
// state (nostr) that the desktop app does not use.
import fs from "fs";
import path from "path";
import type { HDKey } from "@scure/bip32";
import { toHex } from "../../extras/lbc/encoding/bytes";
import { randomBytes } from "../../extras/lbc/crypto/hash";
import {
  AddressDeriver,
  deriveAccountKey,
  derivePrivateKey,
  publicOnly,
  type DerivationScheme,
} from "../../extras/lbc/keys/hd";
import { checkPhrase, cleanPhrase, generateMnemonic } from "../../extras/lbc/keys/mnemonic";
import { getNetwork, type NetworkName } from "../../extras/lbc/networks";
import { DEFAULT_KDF, openJson, sealJson, WrongPasswordError, type SealedBox } from "../../extras/lbc/vault";
import { findLbrynetWallet, lbrynetWalletFiles } from "./lbrynet";

export { WrongPasswordError };

const SECRET_PURPOSE = "desktop-wallet/secret";
const MIN_PASSWORD_LENGTH = 8;
const MIN_PHRASE_WORDS = 12;

export class WalletError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WalletError";
  }
}

export class WalletLockedError extends WalletError {
  constructor() {
    super("Your wallet is locked. Unlock it with your password first.");
    this.name = "WalletLockedError";
  }
}

export interface WalletFile {
  format: "lbry-desktop-wallet";
  version: 1;
  id: string;
  name: string;
  network: NetworkName;
  scheme: DerivationScheme;
  createdAt: number;
  /** Account public key. Not secret, but it reveals the wallet's addresses to whoever has it. */
  xpub: string;
  secret: SealedBox;
}

interface SecretPayload {
  mnemonic: string;
  passphrase?: string;
}

export interface WalletStatus {
  exists: boolean;
  /** True when the wallet exists and no password has been given since the app started or it was locked. */
  locked: boolean;
  id?: string;
  name?: string;
  network?: NetworkName;
  scheme?: DerivationScheme;
  xpub?: string;
  /** Set when wallet.json exists but cannot be read; the file is left alone. */
  error?: string;
  /** When unlocked: the time (ms since the epoch) the wallet locks itself unless it is used first. */
  autoLockAt?: number;
}

export interface WalletAddress {
  address: string;
  chain: number;
  index: number;
}

export interface StoreOptions {
  network?: NetworkName;
  /** scrypt cost; only tests lower it. */
  kdfCost?: typeof DEFAULT_KDF;
  now?: () => number;
  /** Where to look for an existing lbrynet wallet; tests point it at temporary files. */
  lbrynetFiles?: string[];
  /** How long an unlocked wallet may sit unused before it locks itself. 0 turns this off. */
  autoLockMs?: number;
}

export const DEFAULT_AUTO_LOCK_MS = 15 * 60 * 1000;

export class WalletStore {
  private readonly file: string;
  private readonly network: NetworkName;
  private readonly kdfCost: typeof DEFAULT_KDF;
  private readonly now: () => number;
  private readonly lbrynetFiles: string[] | undefined;
  private readonly autoLockMs: number;
  private account: HDKey | null = null;
  private lockTimer: ReturnType<typeof setTimeout> | null = null;
  private lockAt: number | null = null;
  private listeners = new Set<(status: WalletStatus) => void>();
  private queue: Promise<unknown> = Promise.resolve();

  constructor(
    private readonly dir: string,
    options: StoreOptions = {}
  ) {
    this.file = path.join(dir, "wallet.json");
    this.network = options.network || "mainnet";
    this.kdfCost = options.kdfCost || DEFAULT_KDF;
    this.now = options.now || Date.now;
    this.lbrynetFiles = options.lbrynetFiles;
    this.autoLockMs = options.autoLockMs === undefined ? DEFAULT_AUTO_LOCK_MS : options.autoLockMs;
  }

  /** Called whenever the wallet locks or unlocks, including when it locks itself. Returns a way to stop. */
  onLockChange(listener: (status: WalletStatus) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const status = this.status();
    this.listeners.forEach((listener) => {
      try {
        listener(status);
      } catch {
        // A listener that throws must not stop the others or leave the wallet unlocked.
      }
    });
  }

  /** Restarts the idle countdown. Anything that uses the unlocked key should call this. */
  touch() {
    if (this.lockTimer) clearTimeout(this.lockTimer);
    this.lockTimer = null;
    this.lockAt = null;
    if (!this.account || this.autoLockMs <= 0) return;
    this.lockAt = this.now() + this.autoLockMs;
    this.lockTimer = setTimeout(() => this.lock(), this.autoLockMs);
    // Never keep the app alive just for this.
    (this.lockTimer as { unref?: () => void }).unref?.();
  }

  /** Runs one operation at a time, so two creates or a create and an unlock cannot interleave. */
  private run<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.queue.then(operation, operation);
    this.queue = result.catch(() => undefined);
    return result;
  }

  private read(): WalletFile | null {
    let raw: string;
    try {
      raw = fs.readFileSync(this.file, "utf8");
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw new WalletError(`Could not read the wallet file: ${(e as Error).message}`);
    }
    let value: WalletFile;
    try {
      value = JSON.parse(raw);
    } catch {
      throw new WalletError("The wallet file is not valid JSON. It has been left untouched.");
    }
    if (
      !value ||
      value.format !== "lbry-desktop-wallet" ||
      value.version !== 1 ||
      !value.secret ||
      !value.xpub ||
      !value.id
    ) {
      throw new WalletError("The wallet file is not a LBRY Desktop wallet. It has been left untouched.");
    }
    return value;
  }

  private write(wallet: WalletFile) {
    fs.mkdirSync(this.dir, { recursive: true, mode: 0o700 });
    const temporary = path.join(this.dir, `wallet.json.${toHex(randomBytes(4))}.tmp`);
    try {
      fs.writeFileSync(temporary, JSON.stringify(wallet, null, 2) + "\n", { mode: 0o600 });
      fs.renameSync(temporary, this.file);
    } finally {
      fs.rmSync(temporary, { force: true });
    }
  }

  status(): WalletStatus {
    try {
      const wallet = this.read();
      if (!wallet) return { exists: false, locked: true };
      return {
        exists: true,
        locked: this.account === null,
        id: wallet.id,
        name: wallet.name,
        network: wallet.network,
        scheme: wallet.scheme,
        xpub: wallet.xpub,
        ...(this.account && this.lockAt ? { autoLockAt: this.lockAt } : {}),
      };
    } catch (e) {
      return { exists: true, locked: true, error: (e as Error).message };
    }
  }

  /** Makes a wallet with a new recovery phrase and returns the phrase once, so it can be shown for backup. */
  create(params: { password: string; name?: string; words?: 12 | 24 }): Promise<{ mnemonic: string } & WalletStatus> {
    return this.run(async () => {
      const mnemonic = generateMnemonic(params.words === 24 ? 24 : 12);
      const status = await this.store({ password: params.password, name: params.name, mnemonic, scheme: "lbry" });
      return { mnemonic, ...status };
    });
  }

  /** Makes a wallet from an existing recovery phrase: a LBRY SDK / Odysee phrase ("lbry") or a BIP39 one. */
  import(params: {
    password: string;
    mnemonic: string;
    name?: string;
    scheme?: DerivationScheme;
    passphrase?: string;
  }): Promise<WalletStatus> {
    return this.run(() =>
      this.store({
        password: params.password,
        name: params.name,
        mnemonic: params.mnemonic,
        scheme: params.scheme || "lbry",
        passphrase: params.passphrase,
      })
    );
  }

  private async store(params: {
    password: string;
    name?: string;
    mnemonic: string;
    scheme: DerivationScheme;
    passphrase?: string;
  }): Promise<WalletStatus> {
    if (typeof params.password !== "string" || params.password.length < MIN_PASSWORD_LENGTH) {
      throw new WalletError(`The password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
    }
    if (params.scheme !== "lbry" && params.scheme !== "bip44") throw new WalletError("Unknown derivation scheme.");
    const mnemonic = cleanPhrase(params.mnemonic || "");
    if (mnemonic.split(" ").length < MIN_PHRASE_WORDS) {
      throw new WalletError(`A recovery phrase has at least ${MIN_PHRASE_WORDS} words.`);
    }
    if (params.scheme === "bip44" && !checkPhrase(mnemonic).bip39Valid) {
      throw new WalletError("This is not a valid BIP39 recovery phrase (checksum mismatch).");
    }
    // Never replace a wallet: that would destroy the only copy of its keys.
    let existing: WalletFile | null;
    try {
      existing = this.read();
    } catch (e) {
      throw new WalletError(`A wallet file is already here and cannot be read: ${(e as Error).message}`);
    }
    if (existing) throw new WalletError("A wallet already exists. Back it up and remove it first.");

    const passphrase = params.scheme === "bip44" ? params.passphrase || undefined : undefined;
    const network = getNetwork(this.network);
    const account = deriveAccountKey(mnemonic, params.scheme, network, { passphrase });
    const wallet: WalletFile = {
      format: "lbry-desktop-wallet",
      version: 1,
      id: toHex(randomBytes(8)),
      name: (params.name || "").trim().slice(0, 64) || "My Wallet",
      network: this.network,
      scheme: params.scheme,
      createdAt: this.now(),
      xpub: publicOnly(account, network).publicExtendedKey,
      secret: await sealJson({ mnemonic, passphrase } as SecretPayload, params.password, SECRET_PURPOSE, this.kdfCost),
    };
    account.wipePrivateData();
    this.write(wallet);
    this.account = null;
    return this.status();
  }

  private async open(wallet: WalletFile, password: string): Promise<{ account: HDKey; secret: SecretPayload }> {
    const secret = await openJson<SecretPayload>(wallet.secret, password, SECRET_PURPOSE);
    const account = deriveAccountKey(secret.mnemonic, wallet.scheme, getNetwork(wallet.network), {
      passphrase: secret.passphrase,
    });
    if (publicOnly(account, getNetwork(wallet.network)).publicExtendedKey !== wallet.xpub) {
      account.wipePrivateData();
      throw new WalletError("The wallet file is damaged: its keys do not match its public key.");
    }
    return { account, secret };
  }

  private requireWallet(): WalletFile {
    const wallet = this.read();
    if (!wallet) throw new WalletError("There is no wallet yet.");
    return wallet;
  }

  /** Checks the password and keeps the account key in memory until lock(). Throws WrongPasswordError. */
  unlock(password: string): Promise<WalletStatus> {
    return this.run(async () => {
      const wallet = this.requireWallet();
      const { account } = await this.open(wallet, password);
      this.account?.wipePrivateData();
      this.account = account;
      this.touch();
      this.notify();
      return this.status();
    });
  }

  lock(): WalletStatus {
    const wasUnlocked = this.account !== null;
    this.account?.wipePrivateData();
    this.account = null;
    this.touch();
    if (wasUnlocked) this.notify();
    return this.status();
  }

  /** Returns the recovery phrase after re-checking the password, whether or not the wallet is unlocked. */
  reveal(password: string): Promise<{ mnemonic: string; scheme: DerivationScheme; passphrase?: string }> {
    return this.run(async () => {
      const wallet = this.requireWallet();
      const { account, secret } = await this.open(wallet, password);
      account.wipePrivateData();
      return { mnemonic: secret.mnemonic, scheme: wallet.scheme, passphrase: secret.passphrase };
    });
  }

  changePassword(oldPassword: string, newPassword: string): Promise<WalletStatus> {
    return this.run(async () => {
      if (typeof newPassword !== "string" || newPassword.length < MIN_PASSWORD_LENGTH) {
        throw new WalletError(`The password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      }
      const wallet = this.requireWallet();
      const { account, secret } = await this.open(wallet, oldPassword);
      account.wipePrivateData();
      this.write({ ...wallet, secret: await sealJson(secret, newPassword, SECRET_PURPOSE, this.kdfCost) });
      return this.status();
    });
  }

  /**
   * Runs `use` with a way to get the private key of one address, and nothing else: the keys never leave this
   * process and `use` cannot keep them (each is the caller's to wipe). Throws WalletLockedError when locked, and
   * counts as use, so the idle countdown restarts.
   */
  withKeys<T>(use: (keyFor: (chain: number, index: number) => Uint8Array) => T): T {
    const account = this.account;
    if (!account) throw new WalletLockedError();
    this.touch();
    return use((chain, index) => {
      if ((chain !== 0 && chain !== 1) || !Number.isInteger(index) || index < 0) {
        throw new WalletError("That is not an address of this wallet.");
      }
      return derivePrivateKey(account, chain, index);
    });
  }

  /** Receiving (chain 0) or change (chain 1) addresses from the public key; works while locked. */
  addresses(chain: number, start: number, count: number): WalletAddress[] {
    if (chain !== 0 && chain !== 1) throw new WalletError("chain must be 0 (receiving) or 1 (change).");
    if (!Number.isInteger(start) || start < 0 || !Number.isInteger(count) || count < 0 || count > 500) {
      throw new WalletError("start must be 0 or more and count between 0 and 500.");
    }
    const wallet = this.requireWallet();
    const deriver = AddressDeriver.fromExtendedKey(wallet.xpub, getNetwork(wallet.network));
    const list: WalletAddress[] = [];
    for (let i = 0; i < count; i++) {
      list.push({ address: deriver.derive(chain, start + i).address, chain, index: start + i });
    }
    return list;
  }

  /**
   * Looks for an existing lbrynet wallet. Reports only whether there is one, where, and whether it can be
   * brought in; the recovery phrase never leaves this process.
   */
  findLbrynet(): { found: boolean; path?: string; name?: string; encrypted?: boolean; error?: string } {
    try {
      const found = findLbrynetWallet(this.lbrynetFiles || lbrynetWalletFiles());
      if (!found) return { found: false };
      const account = found.accounts[0];
      return {
        found: true,
        path: found.path,
        name: found.name,
        encrypted: !account || account.encrypted || !account.seed,
      };
    } catch (e) {
      return { found: false, error: (e as Error).message };
    }
  }

  /**
   * Creates this wallet from the existing lbrynet wallet's recovery phrase. It checks that the phrase really
   * gives the file's public key first, and only reads the lbrynet file.
   */
  importLbrynet(password: string): Promise<WalletStatus> {
    return this.run(async () => {
      let found;
      try {
        found = findLbrynetWallet(this.lbrynetFiles || lbrynetWalletFiles());
      } catch (e) {
        throw new WalletError((e as Error).message);
      }
      if (!found) throw new WalletError("No LBRY wallet was found on this computer.");
      const account = found.accounts[0];
      if (!account) throw new WalletError("The LBRY wallet has no account.");
      if (account.encrypted || !account.seed) {
        throw new WalletError(
          "The LBRY wallet is protected with a password, so its recovery phrase cannot be read. Restore it with the recovery phrase instead."
        );
      }
      const network = getNetwork(this.network);
      const derived = deriveAccountKey(cleanPhrase(account.seed), "lbry", network);
      const matches = publicOnly(derived, network).publicExtendedKey === account.publicKey;
      derived.wipePrivateData();
      if (!matches) {
        throw new WalletError(
          "The recovery phrase in the LBRY wallet does not match its public key, so nothing was imported."
        );
      }
      return this.store({ password, name: found.name, mnemonic: account.seed, scheme: "lbry" });
    });
  }
}
