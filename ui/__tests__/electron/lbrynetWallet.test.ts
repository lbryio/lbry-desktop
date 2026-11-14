import path from "path";
import { lbrynetWalletFiles } from "../../../electron/wallet/lbrynet";

// Where the SDK keeps its wallet (lbry-sdk lbry/conf.py), most likely first.
describe("lbrynetWalletFiles", () => {
  it("linux: the legacy ~/.lbryum, then the XDG data folder", () => {
    expect(lbrynetWalletFiles({ platform: "linux", home: "/home/u", env: {} })).toEqual([
      "/home/u/.lbryum/wallets/default_wallet",
      "/home/u/.local/share/lbry/lbryum/wallets/default_wallet",
    ]);
    expect(lbrynetWalletFiles({ platform: "linux", home: "/home/u", env: { XDG_DATA_HOME: "/data" } })[1]).toBe(
      "/data/lbry/lbryum/wallets/default_wallet"
    );
  });

  it("macOS: ~/.lbryum", () => {
    expect(lbrynetWalletFiles({ platform: "darwin", home: "/Users/u", env: {} })).toEqual([
      "/Users/u/.lbryum/wallets/default_wallet",
    ]);
  });

  it("windows: %APPDATA%\\lbryum, then %LOCALAPPDATA%\\lbry\\lbryum", () => {
    const files = lbrynetWalletFiles({
      platform: "win32",
      home: "C:\\Users\\u",
      env: { APPDATA: "C:\\Users\\u\\AppData\\Roaming", LOCALAPPDATA: "C:\\Users\\u\\AppData\\Local" },
    });
    expect(files).toHaveLength(2);
    expect(files[0]).toContain(path.join("lbryum", "wallets", "default_wallet"));
    expect(files[1]).toContain(path.join("lbry", "lbryum", "wallets", "default_wallet"));
    expect(files[1]).toContain("Local");
  });
});
