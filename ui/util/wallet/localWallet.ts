// The renderer's side of the main-process wallet (electron/wallet). Every wallet:* channel answers
// { ok, result } or { ok: false, error: { name, message } }; this turns that back into a resolved or
// rejected promise.
type IpcInvoker = { invoke(channel: string, ...args: any[]): Promise<any> };

export async function walletCall(ipc: IpcInvoker, channel: string, ...args: any[]): Promise<any> {
  const reply = await ipc.invoke(channel, ...args);
  if (reply && reply.ok) return reply.result;
  const error = new Error((reply && reply.error && reply.error.message) || "The wallet did not answer.");
  error.name = (reply && reply.error && reply.error.name) || "WalletError";
  throw error;
}

// Daemon methods the local wallet answers instead of the daemon, and the channel behind each.
export const LOCAL_WALLET_METHODS: Record<string, string> = {
  address_unused: "wallet:addressUnused",
  address_list: "wallet:addressList",
  account_list: "wallet:accountList",
};

type Registry = { setOverride(name: string, method: (params: any) => Promise<any>): void };

export function installLocalWalletMethods(lbry: Registry, ipc: IpcInvoker) {
  Object.keys(LOCAL_WALLET_METHODS).forEach((method) => {
    const channel = LOCAL_WALLET_METHODS[method];
    lbry.setOverride(method, (params) => walletCall(ipc, channel, params));
  });
}

// The wallet's own operations, for the UI that creates, imports and unlocks it.
export const localWallet = (ipc: IpcInvoker) => ({
  status: () => walletCall(ipc, "wallet:status"),
  create: (options: { password: string; name?: string; words?: 12 | 24 }) => walletCall(ipc, "wallet:create", options),
  import: (options: { password: string; mnemonic: string; name?: string; scheme?: "lbry" | "bip44" }) =>
    walletCall(ipc, "wallet:import", options),
  findLbrynet: () => walletCall(ipc, "wallet:findLbrynet"),
  importLbrynet: (password: string) => walletCall(ipc, "wallet:importLbrynet", password),
  unlock: (password: string) => walletCall(ipc, "wallet:unlock", password),
  lock: () => walletCall(ipc, "wallet:lock"),
  reveal: (password: string) => walletCall(ipc, "wallet:reveal", password),
  changePassword: (oldPassword: string, newPassword: string) =>
    walletCall(ipc, "wallet:changePassword", oldPassword, newPassword),
});
