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

import WalletSetup from "../../component/walletSetup/view";

const SEED = "carbon smart garage balance margin twelve chest sword toast envelope bottom stomach absent";
const BIP39 = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
const PASSWORD = "correct horse battery";
const NEW_PHRASE = "alpha bravo charlie delta echo foxtrot golf hotel india juliet kilo lima";

function makeWallet(overrides: Record<string, any> = {}): any {
  return {
    status: jest.fn().mockResolvedValue({ exists: false }),
    create: jest.fn().mockResolvedValue({ mnemonic: NEW_PHRASE }),
    import: jest.fn().mockResolvedValue({ exists: true }),
    ...overrides,
  };
}

async function renderSetup(wallet = makeWallet()) {
  const onWalletReady = jest.fn();
  const view = render(<WalletSetup wallet={wallet as any} onWalletReady={onWalletReady} />);
  // Let the status check finish, so its state update happens inside act().
  await act(async () => {});
  return { wallet, onWalletReady, ...view };
}

const type = (id: string, value: string) => fireEvent.change(screen.getByTestId(id), { target: { value } });

async function openCreate() {
  const ctx = await renderSetup();
  fireEvent.click(await screen.findByText("Create a new wallet"));
  return ctx;
}

async function openImport() {
  const ctx = await renderSetup();
  fireEvent.click(await screen.findByText("I have a recovery phrase"));
  return ctx;
}

describe("WalletSetup: which card shows", () => {
  it("renders nothing while it checks, and nothing when a wallet already exists", async () => {
    const wallet = makeWallet({ status: jest.fn().mockResolvedValue({ exists: true }) });
    const { container } = await renderSetup(wallet);
    expect(wallet.status).toHaveBeenCalled();
    expect(container.textContent).toBe("");
  });

  it("offers to create or restore when there is no wallet", async () => {
    await renderSetup();
    expect(await screen.findByText("Create a new wallet")).toBeTruthy();
    expect(screen.getByText("I have a recovery phrase")).toBeTruthy();
  });

  it("reports an unreadable wallet file and offers nothing that could replace it", async () => {
    const wallet = makeWallet({
      status: jest.fn().mockResolvedValue({ exists: true, error: "The wallet file is not valid JSON." }),
    });
    await renderSetup(wallet);
    expect(await screen.findByText("Your wallet could not be opened")).toBeTruthy();
    expect(screen.getByText("The wallet file is not valid JSON.")).toBeTruthy();
    expect(screen.queryByText("Create a new wallet")).toBeNull();
    expect(wallet.create).not.toHaveBeenCalled();
  });

  it("reports it when the main process does not answer", async () => {
    const wallet = makeWallet({ status: jest.fn().mockRejectedValue(new Error("The wallet did not answer.")) });
    await renderSetup(wallet);
    expect(await screen.findByText("The wallet did not answer.")).toBeTruthy();
  });
});

describe("WalletSetup: create", () => {
  it("checks the passwords before calling the wallet", async () => {
    const { wallet } = await openCreate();
    type("wallet_setup_password", "short");
    type("wallet_setup_password_confirm", "short");
    fireEvent.click(screen.getByText("Create wallet"));
    expect(screen.getByText("The password must be at least 8 characters.")).toBeTruthy();

    type("wallet_setup_password", PASSWORD);
    type("wallet_setup_password_confirm", "something else entirely");
    fireEvent.click(screen.getByText("Create wallet"));
    expect(screen.getByText("The two passwords do not match.")).toBeTruthy();
    expect(wallet.create).not.toHaveBeenCalled();
  });

  it("disables the button until both passwords are typed", async () => {
    await openCreate();
    expect((screen.getByText("Create wallet") as HTMLButtonElement).disabled).toBe(true);
    type("wallet_setup_password", PASSWORD);
    expect((screen.getByText("Create wallet") as HTMLButtonElement).disabled).toBe(true);
    type("wallet_setup_password_confirm", PASSWORD);
    expect((screen.getByText("Create wallet") as HTMLButtonElement).disabled).toBe(false);
  });

  it("shows the new phrase once, and only continues after it is confirmed saved", async () => {
    const { wallet, onWalletReady, container } = await openCreate();
    type("wallet_setup_password", PASSWORD);
    type("wallet_setup_password_confirm", PASSWORD);
    fireEvent.click(screen.getByText("Create wallet"));

    expect((await screen.findByTestId("copyable")).textContent).toBe(NEW_PHRASE);
    expect(wallet.create).toHaveBeenCalledWith({ password: PASSWORD });
    // The password fields are gone, so the password is not sitting in the page.
    expect(screen.queryByTestId("wallet_setup_password")).toBeNull();
    expect(container.innerHTML).not.toContain(PASSWORD);

    const next = screen.getByText("Continue") as HTMLButtonElement;
    expect(next.disabled).toBe(true);
    expect(onWalletReady).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("wallet_setup_saved"));
    expect((screen.getByText("Continue") as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(screen.getByText("Continue"));

    expect(onWalletReady).toHaveBeenCalledTimes(1);
    expect(container.textContent).toBe(""); // the phrase is no longer on screen
  });

  it("shows the error from the main process and keeps the form", async () => {
    const wallet = makeWallet({ create: jest.fn().mockRejectedValue(new Error("A wallet already exists.")) });
    const { onWalletReady } = await renderSetup(wallet);
    fireEvent.click(await screen.findByText("Create a new wallet"));
    type("wallet_setup_password", PASSWORD);
    type("wallet_setup_password_confirm", PASSWORD);
    fireEvent.click(screen.getByText("Create wallet"));

    expect(await screen.findByText("A wallet already exists.")).toBeTruthy();
    expect(screen.queryByTestId("copyable")).toBeNull();
    expect(onWalletReady).not.toHaveBeenCalled();
  });

  it("goes back to the choice", async () => {
    await openCreate();
    fireEvent.click(screen.getByText("Back"));
    expect(screen.getByText("Create a new wallet")).toBeTruthy();
  });
});

describe("WalletSetup: import", () => {
  it("needs at least 12 words", async () => {
    const { wallet } = await openImport();
    type("wallet_setup_phrase", "too few words here");
    type("wallet_setup_password", PASSWORD);
    type("wallet_setup_password_confirm", PASSWORD);
    fireEvent.click(screen.getByText("Restore wallet"));
    expect(screen.getByText("A recovery phrase has at least 12 words.")).toBeTruthy();
    expect(wallet.import).not.toHaveBeenCalled();
  });

  it("imports a LBRY phrase with the LBRY scheme, tidied up, then reports ready", async () => {
    const { wallet, onWalletReady, container } = await openImport();
    type("wallet_setup_phrase", `  ${SEED.toUpperCase()} \n`);
    type("wallet_setup_password", PASSWORD);
    type("wallet_setup_password_confirm", PASSWORD);
    fireEvent.click(screen.getByText("Restore wallet"));

    await waitFor(() => expect(onWalletReady).toHaveBeenCalledTimes(1));
    expect(wallet.import).toHaveBeenCalledWith({ password: PASSWORD, mnemonic: SEED, scheme: "lbry" });
    expect(container.textContent).toBe("");
  });

  it("flags unrecognised words without blocking", async () => {
    await openImport();
    type("wallet_setup_phrase", `${SEED} zzzzzz`);
    expect(screen.getByText(/Unrecognized words: zzzzzz/)).toBeTruthy();
  });

  it("asks which wallet a BIP39 phrase is from, and passes the choice", async () => {
    const { wallet, onWalletReady } = await openImport();
    type("wallet_setup_phrase", BIP39);
    expect(screen.getByTestId("wallet_setup_scheme")).toBeTruthy();
    fireEvent.change(screen.getByTestId("wallet_setup_scheme"), { target: { value: "bip44" } });
    type("wallet_setup_password", PASSWORD);
    type("wallet_setup_password_confirm", PASSWORD);
    fireEvent.click(screen.getByText("Restore wallet"));

    await waitFor(() => expect(onWalletReady).toHaveBeenCalled());
    expect(wallet.import).toHaveBeenCalledWith({ password: PASSWORD, mnemonic: BIP39, scheme: "bip44" });
  });

  it("does not offer the choice for a phrase that is not valid BIP39", async () => {
    await openImport();
    type("wallet_setup_phrase", SEED);
    expect(screen.queryByTestId("wallet_setup_scheme")).toBeNull();
  });

  it("shows the error from the main process and does not report ready", async () => {
    const wallet = makeWallet({ import: jest.fn().mockRejectedValue(new Error("Incorrect something")) });
    const { onWalletReady } = await renderSetup(wallet);
    fireEvent.click(await screen.findByText("I have a recovery phrase"));
    type("wallet_setup_phrase", SEED);
    type("wallet_setup_password", PASSWORD);
    type("wallet_setup_password_confirm", PASSWORD);
    fireEvent.click(screen.getByText("Restore wallet"));

    expect(await screen.findByText("Incorrect something")).toBeTruthy();
    expect(onWalletReady).not.toHaveBeenCalled();
  });
});

describe("WalletSetup: use my existing LBRY wallet", () => {
  const found = {
    found: true,
    path: "/home/u/.local/share/lbry/lbryum/wallets/default_wallet",
    name: "My Wallet",
    encrypted: false,
  };

  async function renderWithExisting(existing: any, extra: Record<string, any> = {}) {
    const wallet = makeWallet({
      findLbrynet: jest.fn().mockResolvedValue(existing),
      importLbrynet: jest.fn().mockResolvedValue({ exists: true }),
      ...extra,
    });
    const ctx = await renderSetup(wallet);
    return ctx;
  }

  it("offers it first when an unprotected wallet is found", async () => {
    await renderWithExisting(found);
    expect(await screen.findByText("Import my existing LBRY wallet")).toBeTruthy();
    expect(screen.getByText(/We found a LBRY wallet on this computer \(My Wallet\)/)).toBeTruthy();
    expect(screen.getByText("Create a new wallet")).toBeTruthy();
    expect(screen.getByText("I have a recovery phrase")).toBeTruthy();
  });

  it("does not offer it when nothing is found, or when the check fails", async () => {
    await renderWithExisting({ found: false });
    expect(screen.queryByText("Import my existing LBRY wallet")).toBeNull();
    expect(screen.getByText("Create a new wallet")).toBeTruthy();
  });

  it("copes with the check failing", async () => {
    await renderWithExisting(null, { findLbrynet: jest.fn().mockRejectedValue(new Error("boom")) });
    expect(await screen.findByText("Create a new wallet")).toBeTruthy();
    expect(screen.queryByText("Import my existing LBRY wallet")).toBeNull();
  });

  it("explains that a password-protected wallet has to be restored with its phrase", async () => {
    await renderWithExisting({ ...found, encrypted: true });
    expect(await screen.findByText(/protected with a password, so it cannot be brought in automatically/)).toBeTruthy();
    expect(screen.queryByText("Import my existing LBRY wallet")).toBeNull();
    expect(screen.getByText("I have a recovery phrase")).toBeTruthy();
  });

  it("asks for a new password, says the old file is untouched, and imports with it", async () => {
    const { wallet, onWalletReady, container } = await renderWithExisting(found);
    fireEvent.click(await screen.findByText("Import my existing LBRY wallet"));
    expect(screen.getByText(/Your existing wallet file is not changed or deleted/)).toBeTruthy();

    type("wallet_setup_password", "short");
    type("wallet_setup_password_confirm", "short");
    fireEvent.click(screen.getByText("Import this wallet"));
    expect(screen.getByText("The password must be at least 8 characters.")).toBeTruthy();
    expect(wallet.importLbrynet).not.toHaveBeenCalled();

    type("wallet_setup_password", PASSWORD);
    type("wallet_setup_password_confirm", PASSWORD);
    fireEvent.click(screen.getByText("Import this wallet"));

    await waitFor(() => expect(onWalletReady).toHaveBeenCalledTimes(1));
    expect(wallet.importLbrynet).toHaveBeenCalledWith(PASSWORD);
    // The phrase is never shown for an existing wallet: its owner already has it.
    expect(screen.queryByTestId("copyable")).toBeNull();
    expect(container.textContent).toBe("");
  });

  it("shows the error from the main process and does not report ready", async () => {
    const { onWalletReady } = await renderWithExisting(found, {
      importLbrynet: jest.fn().mockRejectedValue(new Error("does not match its public key")),
    });
    fireEvent.click(await screen.findByText("Import my existing LBRY wallet"));
    type("wallet_setup_password", PASSWORD);
    type("wallet_setup_password_confirm", PASSWORD);
    fireEvent.click(screen.getByText("Import this wallet"));

    expect(await screen.findByText("does not match its public key")).toBeTruthy();
    expect(onWalletReady).not.toHaveBeenCalled();
  });

  it("goes back to the choice", async () => {
    await renderWithExisting(found);
    fireEvent.click(await screen.findByText("Import my existing LBRY wallet"));
    fireEvent.click(screen.getByText("Back"));
    expect(screen.getByText("Create a new wallet")).toBeTruthy();
  });
});
