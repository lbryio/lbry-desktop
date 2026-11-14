import fs from "fs";
import os from "os";
import path from "path";
import { registerWalletIpc } from "../../../electron/wallet/ipc";
import { WalletService } from "../../../electron/wallet/service";
import { WalletStore } from "../../../electron/wallet/store";

const SEED = "carbon smart garage balance margin twelve chest sword toast envelope bottom stomach absent";

function setup() {
  const handlers: Record<string, (event: unknown, ...args: any[]) => Promise<any>> = {};
  const ipcMain: any = { handle: (channel: string, fn: any) => (handlers[channel] = fn) };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lbry-wallet-ipc-"));
  const store = new WalletStore(dir, { kdfCost: { N: 1 << 10, r: 8, p: 1 } });
  const service = new WalletService(store, async () => ({
    subscribeAddresses: async (a: string[]) => a.map(() => null),
  }));
  registerWalletIpc(ipcMain, store, service);
  const call = (channel: string, ...args: any[]) => handlers[channel]({}, ...args);
  return { call, handlers, dir };
}

describe("wallet IPC", () => {
  it("registers every channel", () => {
    expect(Object.keys(setup().handlers).sort()).toEqual([
      "wallet:accountList",
      "wallet:addressList",
      "wallet:addressUnused",
      "wallet:addresses",
      "wallet:balance",
      "wallet:changePassword",
      "wallet:create",
      "wallet:findLbrynet",
      "wallet:import",
      "wallet:importLbrynet",
      "wallet:lock",
      "wallet:reveal",
      "wallet:send",
      "wallet:status",
      "wallet:unlock",
    ]);
  });

  it("answers { ok, result } and { ok: false, error } so error names survive the trip", async () => {
    const { call, dir } = setup();
    try {
      expect(await call("wallet:status")).toEqual({ ok: true, result: { exists: false, locked: true } });

      const imported = await call("wallet:import", { password: "correct horse", mnemonic: SEED });
      expect(imported.ok).toBe(true);
      expect(imported.result.exists).toBe(true);
      expect(imported.result).not.toHaveProperty("mnemonic");

      const wrong = await call("wallet:unlock", "wrong password");
      expect(wrong).toEqual({ ok: false, error: { name: "WrongPasswordError", message: "Incorrect password" } });
      expect((await call("wallet:unlock", "correct horse")).result.locked).toBe(false);
      expect((await call("wallet:lock")).result.locked).toBe(true);

      const addresses = await call("wallet:addresses", 0, 0, 1);
      expect(addresses.result).toEqual([{ address: "bCqJrLHdoiRqEZ1whFZ3WHNb33bP34SuGx", chain: 0, index: 0 }]);

      expect((await call("wallet:addressUnused")).result).toBe("bCqJrLHdoiRqEZ1whFZ3WHNb33bP34SuGx");
      expect((await call("wallet:accountList")).result.lbc_mainnet).toHaveLength(1);
      expect((await call("wallet:addressList", { page_size: 3 })).result.items).toHaveLength(3);

      const again = await call("wallet:create", { password: "correct horse" });
      expect(again.ok).toBe(false);
      expect(again.error.name).toBe("WalletError");

      const noArguments = await call("wallet:import");
      expect(noArguments.ok).toBe(false);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("does not register the service channels without a service", () => {
    const handlers: Record<string, unknown> = {};
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lbry-wallet-ipc-"));
    registerWalletIpc({ handle: (channel: string, fn: any) => (handlers[channel] = fn) }, new WalletStore(dir));
    fs.rmSync(dir, { recursive: true, force: true });
    expect(handlers).not.toHaveProperty("wallet:addressUnused");
    expect(handlers).toHaveProperty("wallet:status");
  });
});
