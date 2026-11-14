/**
 * @jest-environment jsdom
 */
import * as React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";

jest.mock("component/copyableText", () => {
  const MockReact = require("react");
  return {
    __esModule: true,
    default: (props: any) => MockReact.createElement("div", { "data-testid": "copyable" }, props.copyable),
  };
});

jest.mock("component/button", () => {
  const MockReact = require("react");
  return {
    __esModule: true,
    default: (props: any) =>
      MockReact.createElement(
        "button",
        { onClick: props.onClick, disabled: props.disabled, type: props.type || "button" },
        props.label
      ),
  };
});

// The real form components pull in the markdown editor and redux actions.
jest.mock("component/common/form", () => {
  const MockReact = require("react");
  return {
    __esModule: true,
    Form: (props: any) =>
      MockReact.createElement(
        "form",
        {
          onSubmit: (e: any) => {
            e.preventDefault();
            props.onSubmit();
          },
        },
        props.children
      ),
    FormField: (props: any) => {
      const common = { "data-testid": props.name, name: props.name, onChange: props.onChange };
      if (props.type === "textarea") return MockReact.createElement("textarea", { ...common, value: props.value });
      if (props.type === "select")
        return MockReact.createElement("select", { ...common, value: props.value }, props.children);
      if (props.type === "checkbox")
        return MockReact.createElement("input", { ...common, type: "checkbox", checked: props.checked });
      return MockReact.createElement("input", { ...common, type: props.type, value: props.value });
    },
  };
});

import WalletLock from "../../component/walletLock/view";

const PASSWORD = "correct horse battery";

function makeWallet(status: any, overrides: Record<string, any> = {}): any {
  return {
    status: jest.fn().mockResolvedValue(status),
    unlock: jest.fn().mockResolvedValue({ exists: true, locked: false }),
    lock: jest.fn().mockResolvedValue({ exists: true, locked: true }),
    ...overrides,
  };
}

async function renderLock(wallet: any) {
  let push: (status: any) => void = () => {};
  const stop = jest.fn();
  const subscribe = jest.fn((listener: (status: any) => void) => {
    push = listener;
    return stop;
  });
  const view = render(<WalletLock wallet={wallet} subscribe={subscribe} />);
  await act(async () => {});
  return { ...view, push: (status: any) => act(async () => push(status)), stop, subscribe };
}

const type = (value: string) => fireEvent.change(screen.getByTestId("wallet_lock_password"), { target: { value } });

describe("WalletLock", () => {
  it("shows nothing without a wallet, or when the file cannot be read", async () => {
    const none = await renderLock(makeWallet({ exists: false, locked: true }));
    expect(none.container.textContent).toBe("");
    none.unmount();
    const broken = await renderLock(makeWallet({ exists: true, locked: true, error: "bad file" }));
    expect(broken.container.textContent).toBe("");
  });

  it("asks for the password while locked, and unlocks", async () => {
    const wallet = makeWallet({ exists: true, locked: true });
    await renderLock(wallet);
    expect(screen.getByText("Wallet locked")).toBeTruthy();
    const button = screen.getByText("Unlock wallet").closest("button") as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    type(PASSWORD);
    fireEvent.click(screen.getByText("Unlock wallet"));
    await waitFor(() => screen.getByText("Wallet unlocked"));
    expect(wallet.unlock).toHaveBeenCalledWith(PASSWORD);
  });

  it("shows the error for a wrong password and stays locked", async () => {
    const wallet = makeWallet(
      { exists: true, locked: true },
      { unlock: jest.fn().mockRejectedValue(new Error("Wrong password.")) }
    );
    await renderLock(wallet);
    type("nope nope nope");
    fireEvent.click(screen.getByText("Unlock wallet"));
    expect(await screen.findByText("Wrong password.")).toBeTruthy();
    expect(screen.getByText("Wallet locked")).toBeTruthy();
  });

  it("locks on request", async () => {
    const wallet = makeWallet({ exists: true, locked: false });
    await renderLock(wallet);
    fireEvent.click(screen.getByText("Lock wallet"));
    await waitFor(() => screen.getByText("Wallet locked"));
    expect(wallet.lock).toHaveBeenCalled();
  });

  it("follows the main process when it locks the wallet itself, and drops the typed password", async () => {
    const wallet = makeWallet({ exists: true, locked: false });
    const { push } = await renderLock(wallet);
    expect(screen.getByText("Wallet unlocked")).toBeTruthy();

    await push({ exists: true, locked: true });
    expect(screen.getByText("Wallet locked")).toBeTruthy();
    type(PASSWORD);
    await push({ exists: true, locked: false });
    await push({ exists: true, locked: true });
    expect((screen.getByTestId("wallet_lock_password") as HTMLInputElement).value).toBe("");
  });

  it("stops listening when it goes away", async () => {
    const { unmount, stop } = await renderLock(makeWallet({ exists: true, locked: true }));
    unmount();
    expect(stop).toHaveBeenCalled();
  });
});
