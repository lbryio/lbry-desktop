// Finding and reading the wallet file of an existing lbrynet (the Python SDK), so its owner can bring their
// wallet into the app without retyping the recovery phrase. This only ever reads the file.
import fs from "fs";
import os from "os";
import path from "path";

export interface LbrynetEnvironment {
  platform: NodeJS.Platform;
  home: string;
  env: Record<string, string | undefined>;
}

export function currentEnvironment(): LbrynetEnvironment {
  return { platform: process.platform, home: os.homedir(), env: process.env };
}

/** Where the SDK keeps its default wallet, most likely first (lbry-sdk lbry/conf.py). */
export function lbrynetWalletFiles(e: LbrynetEnvironment = currentEnvironment()): string[] {
  const file = (...parts: string[]) => path.join(...parts, "wallets", "default_wallet");
  switch (e.platform) {
    case "win32": {
      const appData = e.env.APPDATA || path.join(e.home, "AppData", "Roaming");
      const localAppData = e.env.LOCALAPPDATA || appData;
      return [file(appData, "lbryum"), file(localAppData, "lbry", "lbryum")];
    }
    case "darwin":
      return [file(e.home, ".lbryum")];
    default: {
      const share = e.env.XDG_DATA_HOME || path.join(e.home, ".local", "share");
      return [file(e.home, ".lbryum"), file(share, "lbry", "lbryum")];
    }
  }
}

export interface LbrynetAccount {
  name: string;
  encrypted: boolean;
  publicKey: string;
  seed?: string;
}

export interface LbrynetWallet {
  path: string;
  name: string;
  accounts: LbrynetAccount[];
}

/** Reads and parses a wallet file. Throws an Error with a plain message if it is not one. */
export function readLbrynetWallet(file: string): LbrynetWallet {
  let parsed: any;
  try {
    parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    throw new Error(`Could not read ${file}: ${(e as Error).message}`);
  }
  if (!parsed || !Array.isArray(parsed.accounts)) throw new Error(`${file} is not a LBRY wallet file.`);
  return {
    path: file,
    name: String(parsed.name || "My Wallet"),
    accounts: parsed.accounts.map((a: any) => ({
      name: String(a.name || ""),
      encrypted: Boolean(a.encrypted),
      publicKey: String(a.public_key || ""),
      seed: typeof a.seed === "string" ? a.seed : undefined,
    })),
  };
}

/** The first of the candidate files that exists, parsed. */
export function findLbrynetWallet(candidates: string[]): LbrynetWallet | null {
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return readLbrynetWallet(candidate);
  }
  return null;
}
