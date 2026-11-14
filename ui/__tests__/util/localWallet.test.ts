import { installLocalWalletMethods, LOCAL_WALLET_METHODS, localWallet, walletCall } from "util/wallet/localWallet";

const ipcReturning = (reply: unknown) => ({ invoke: jest.fn().mockResolvedValue(reply) });

describe("walletCall", () => {
  it("resolves with the result", async () => {
    const ipc = ipcReturning({ ok: true, result: { exists: true } });
    await expect(walletCall(ipc, "wallet:status", 1, 2)).resolves.toEqual({ exists: true });
    expect(ipc.invoke).toHaveBeenCalledWith("wallet:status", 1, 2);
  });

  it("rejects with the main process's error name and message", async () => {
    const ipc = ipcReturning({ ok: false, error: { name: "WrongPasswordError", message: "Incorrect password" } });
    await expect(walletCall(ipc, "wallet:unlock", "x")).rejects.toMatchObject({
      name: "WrongPasswordError",
      message: "Incorrect password",
    });
  });

  it("rejects with a plain message when the reply is unusable", async () => {
    await expect(walletCall(ipcReturning(undefined), "wallet:status")).rejects.toThrow("The wallet did not answer.");
  });
});

describe("installLocalWalletMethods", () => {
  it("registers an override for each local method that calls its channel", async () => {
    const overrides: Record<string, (params: any) => Promise<any>> = {};
    const ipc = ipcReturning({ ok: true, result: "bAddress" });
    installLocalWalletMethods({ setOverride: (name, method) => (overrides[name] = method) }, ipc);

    expect(Object.keys(overrides).sort()).toEqual(["account_list", "address_list", "address_unused"]);
    await expect(overrides.address_unused({})).resolves.toBe("bAddress");
    expect(ipc.invoke).toHaveBeenCalledWith(LOCAL_WALLET_METHODS.address_unused, {});
    await overrides.address_list({ page: 2 });
    expect(ipc.invoke).toHaveBeenLastCalledWith("wallet:addressList", { page: 2 });
  });
});

describe("localWallet", () => {
  it("maps each operation to its channel", async () => {
    const ipc = ipcReturning({ ok: true, result: null });
    const wallet = localWallet(ipc);
    await wallet.status();
    await wallet.create({ password: "pw" });
    await wallet.unlock("pw");
    await wallet.changePassword("a", "b");
    expect(ipc.invoke.mock.calls.map((c) => c[0])).toEqual([
      "wallet:status",
      "wallet:create",
      "wallet:unlock",
      "wallet:changePassword",
    ]);
  });
});
