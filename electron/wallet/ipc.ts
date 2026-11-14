import type { WalletStore } from "./store";
import type { WalletService } from "./service";

// The part of Electron's ipcMain this needs, so the handlers can be tested without Electron.
export interface IpcHandleRegistry {
  handle(channel: string, listener: (event: unknown, ...args: any[]) => unknown): void;
}

// Every wallet:* channel answers { ok: true, result } or { ok: false, error: { name, message } }, because an
// error thrown in a handler reaches the renderer with its class name lost.
export function registerWalletIpc(ipcMain: IpcHandleRegistry, store: WalletStore, service?: WalletService) {
  const handle = (channel: string, fn: (...args: any[]) => unknown) =>
    ipcMain.handle(channel, async (_event, ...args) => {
      try {
        return { ok: true, result: await fn(...args) };
      } catch (e) {
        const error = e as Error;
        return { ok: false, error: { name: error.name, message: error.message } };
      }
    });

  handle("wallet:status", () => store.status());
  handle("wallet:create", (options) => store.create(options || {}));
  handle("wallet:import", (options) => store.import(options || {}));
  handle("wallet:findLbrynet", () => store.findLbrynet());
  handle("wallet:importLbrynet", (password) => store.importLbrynet(password));
  handle("wallet:unlock", (password) => store.unlock(password));
  handle("wallet:lock", () => store.lock());
  handle("wallet:reveal", (password) => store.reveal(password));
  handle("wallet:changePassword", (oldPassword, newPassword) => store.changePassword(oldPassword, newPassword));
  handle("wallet:addresses", (chain, start, count) => store.addresses(chain, start, count));

  if (service) {
    handle("wallet:addressUnused", () => service.addressUnused());
    handle("wallet:addressList", (params) => service.addressList(params || {}));
    handle("wallet:accountList", () => service.accountList());
    handle("wallet:balance", () => service.balance());
  }
}
