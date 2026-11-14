// #746: a failing wallet_status used to be swallowed, leaving the splash on "Starting..." with no cause.
jest.mock("css-doodle", () => ({}));
jest.mock("lbry", () => ({
  __esModule: true,
  default: { status: jest.fn(), wallet_status: jest.fn(), resolve: jest.fn() },
}));
jest.mock("component/button", () => () => null);
jest.mock("component/common/card", () => () => null);
jest.mock("component/i18nMessage", () => () => null);
jest.mock("modal/modalWalletUnlock", () => () => null);
jest.mock("modal/modalIncompatibleDaemon", () => () => null);
jest.mock("modal/modalUpgrade", () => () => null);
jest.mock("modal/modalDownloading", () => () => null);

import Lbry from "lbry";
import SplashScreen from "component/splash/view";

const lbry = Lbry as any;

function fakeSplash() {
  const setState = jest.fn();
  return {
    props: { modal: null, notifyUnlockWallet: jest.fn(), clearWalletServers: jest.fn(), doShowSnackBar: jest.fn() },
    state: { launchedModal: false },
    setState,
    updateStatusCallback: jest.fn(),
  };
}

const run = (splash: any) => (SplashScreen.prototype as any).updateStatus.call(splash);
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("SplashScreen.updateStatus", () => {
  beforeEach(() => jest.resetAllMocks());

  it("records the error when wallet_status fails", async () => {
    lbry.status.mockResolvedValue({ is_running: true });
    lbry.wallet_status.mockRejectedValue(new Error("Wallet commands are not implemented for now."));
    const splash = fakeSplash();
    run(splash);
    await flush();
    expect(splash.setState).toHaveBeenCalledWith({ errorDetail: "Wallet commands are not implemented for now." });
    expect(splash.updateStatusCallback).not.toHaveBeenCalled();
  });

  it("records the error when status fails", async () => {
    lbry.status.mockRejectedValue(new Error("connection refused"));
    const splash = fakeSplash();
    run(splash);
    await flush();
    expect(splash.setState).toHaveBeenCalledWith({ errorDetail: "connection refused" });
  });

  it("carries on when both calls succeed", async () => {
    lbry.status.mockResolvedValue({ is_running: true });
    lbry.wallet_status.mockResolvedValue({ is_locked: false });
    const splash = fakeSplash();
    run(splash);
    await flush();
    expect(splash.updateStatusCallback).toHaveBeenCalledWith({ is_running: true }, { is_locked: false });
    expect(splash.setState).not.toHaveBeenCalled();
  });
});
