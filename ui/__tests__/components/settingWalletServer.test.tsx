/**
 * @jest-environment jsdom
 */
// Regression tests for #672: the wallet server setting must only fall back to
// the official servers (settings_clear + wallet_reconnect) when it should, not
// on every re-render.
import * as React from "react";
import { render } from "@testing-library/react";

jest.mock("component/common/form", () => ({ __esModule: true, FormField: () => null }));
jest.mock("component/button", () => ({ __esModule: true, default: () => null }));
jest.mock("component/settingWalletServer/internal/inputRow", () => ({ __esModule: true, default: () => null }));

import SettingWalletServer from "component/settingWalletServer/view";

// A fresh status object each time, like each 5s getDaemonStatus() poll stores.
const status = (availableServers: number) => ({
  wallet: {
    available_servers: availableServers,
    servers: [{ host: "hub.lbry.grin.io", port: 50001, availability: availableServers > 0, latency: 0.2 }],
  },
});

function props(overrides: Record<string, any> = {}): any {
  return {
    daemonStatus: status(1),
    setCustomWalletServers: jest.fn(),
    getDaemonStatus: jest.fn(),
    clearWalletServers: jest.fn(),
    saveServerConfig: jest.fn(),
    customWalletServers: [],
    hasWalletServerPrefs: false,
    walletReconnecting: false,
    walletRollbackToDefault: false,
    walletReconnectingToDefault: false,
    ...overrides,
  };
}

describe("re-renders", () => {
  it.each([
    ["official servers, wallet healthy", { hasWalletServerPrefs: false }, 1],
    ["official servers, hub down", { hasWalletServerPrefs: false }, 0],
    ["custom servers, none reachable", { hasWalletServerPrefs: true }, 0],
  ])("don't clear the wallet servers (%s)", (_label, overrides, available) => {
    const clearWalletServers = jest.fn();
    const p = (extra = {}) => props({ ...overrides, clearWalletServers, daemonStatus: status(available), ...extra });

    const { rerender } = render(<SettingWalletServer {...p()} />);
    for (let i = 0; i < 5; i++) rerender(<SettingWalletServer {...p()} />);

    expect(clearWalletServers).not.toHaveBeenCalled();
  });
});

describe("leaving the page", () => {
  it("falls back to the official servers when custom ones are unreachable", () => {
    const clearWalletServers = jest.fn();
    const { unmount } = render(
      <SettingWalletServer {...props({ hasWalletServerPrefs: true, daemonStatus: status(0), clearWalletServers })} />
    );
    unmount();
    expect(clearWalletServers).toHaveBeenCalledTimes(1);
  });

  it("keeps reachable custom servers", () => {
    const clearWalletServers = jest.fn();
    const { unmount } = render(
      <SettingWalletServer {...props({ hasWalletServerPrefs: true, daemonStatus: status(1), clearWalletServers })} />
    );
    unmount();
    expect(clearWalletServers).not.toHaveBeenCalled();
  });

  it("doesn't reconnect when already on the official servers", () => {
    const clearWalletServers = jest.fn();
    const { unmount } = render(
      <SettingWalletServer {...props({ hasWalletServerPrefs: false, daemonStatus: status(0), clearWalletServers })} />
    );
    unmount();
    expect(clearWalletServers).not.toHaveBeenCalled();
  });

  it("doesn't touch custom servers before the status has loaded", () => {
    const clearWalletServers = jest.fn();
    const { unmount } = render(
      <SettingWalletServer {...props({ hasWalletServerPrefs: true, daemonStatus: undefined, clearWalletServers })} />
    );
    unmount();
    expect(clearWalletServers).not.toHaveBeenCalled();
  });

  it("uses the latest status, not the one from mount", () => {
    const clearWalletServers = jest.fn();
    const p = (available: number) =>
      props({ hasWalletServerPrefs: true, daemonStatus: status(available), clearWalletServers });

    const recovered = render(<SettingWalletServer {...p(0)} />);
    recovered.rerender(<SettingWalletServer {...p(1)} />);
    recovered.unmount();
    expect(clearWalletServers).not.toHaveBeenCalled();

    const dropped = render(<SettingWalletServer {...p(1)} />);
    dropped.rerender(<SettingWalletServer {...p(0)} />);
    dropped.unmount();
    expect(clearWalletServers).toHaveBeenCalledTimes(1);
  });
});

it("rolls back once per rollback, not on every re-render", () => {
  const clearWalletServers = jest.fn();
  const p = (walletRollbackToDefault: boolean) =>
    props({ hasWalletServerPrefs: true, walletRollbackToDefault, clearWalletServers });

  const { rerender } = render(<SettingWalletServer {...p(false)} />);
  for (let i = 0; i < 3; i++) rerender(<SettingWalletServer {...p(true)} />);

  expect(clearWalletServers).toHaveBeenCalledTimes(1);
});
