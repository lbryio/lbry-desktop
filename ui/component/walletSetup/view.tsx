import * as React from "react";
// @ts-expect-error - TS2792 - Cannot find module 'electron'. Did you mean to set the 'moduleResolution' option to 'node', or to add aliases to the 'paths' option?
import { ipcRenderer } from "electron";
import Button from "component/button";
import Card from "component/common/card";
import CopyableText from "component/copyableText";
import { FormField, Form } from "component/common/form";
import { checkPhrase, cleanPhrase } from "util/wallet/mnemonic";
import { localWallet } from "util/wallet/localWallet";
import { validatePasswords } from "util/wallet/setupValidation";

// The operations this needs from the wallet in the main process (see ui/util/wallet/localWallet).
export type WalletApi = {
  status: () => Promise<{ exists: boolean; error?: string }>;
  create: (options: { password: string }) => Promise<{ mnemonic: string }>;
  import: (options: { password: string; mnemonic: string; scheme?: "lbry" | "bip44" }) => Promise<unknown>;
  // An existing lbrynet wallet on this computer (optional: only the Electron app has one to find).
  findLbrynet?: () => Promise<ExistingWallet>;
  importLbrynet?: (password: string) => Promise<unknown>;
};

type ExistingWallet = { found: boolean; path?: string; name?: string; encrypted?: boolean; error?: string };

type Step = "loading" | "none" | "choose" | "create" | "import" | "existing" | "backup" | "done" | "error";

type Props = {
  onWalletReady: () => void;
  // Only tests pass this.
  wallet?: WalletApi;
};

const errorText = (e: any) => String((e && e.message) || e);

export default function WalletSetup(props: Props) {
  const { onWalletReady } = props;
  const wallet = React.useMemo<WalletApi>(
    () => props.wallet || (localWallet(ipcRenderer) as WalletApi),
    [props.wallet]
  );

  const [step, setStep] = React.useState<Step>("loading");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [phrase, setPhrase] = React.useState("");
  const [scheme, setScheme] = React.useState<"lbry" | "bip44">("lbry");
  const [saved, setSaved] = React.useState(false);
  // The new wallet's recovery phrase, held only while the backup step is on screen.
  const [newPhrase, setNewPhrase] = React.useState<string | null>(null);
  const [existing, setExisting] = React.useState<ExistingWallet | null>(null);

  React.useEffect(() => {
    let active = true;
    wallet
      .status()
      .then((status) => {
        if (!active) return;
        if (status.error) {
          setError(status.error);
          setStep("error");
        } else if (status.exists) {
          setStep("none");
        } else {
          setStep("choose");
          // Is there a wallet from the old app to bring in? A failure here just means there is not.
          if (wallet.findLbrynet) {
            wallet
              .findLbrynet()
              .then((found) => active && setExisting(found))
              .catch(() => {});
          }
        }
      })
      .catch((e) => {
        if (!active) return;
        setError(errorText(e));
        setStep("error");
      });
    return () => {
      active = false;
    };
  }, [wallet]);

  function clearSecrets() {
    setPassword("");
    setConfirm("");
    setPhrase("");
  }

  function back() {
    clearSecrets();
    setError(null);
    setStep("choose");
  }

  async function create() {
    const problem = validatePasswords(password, confirm);
    if (problem) {
      setError(__(problem));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const created = await wallet.create({ password });
      clearSecrets();
      setNewPhrase(created.mnemonic);
      setStep("backup");
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  async function importWallet() {
    const check = checkPhrase(phrase);
    if (check.words.length < 12) {
      setError(__("A recovery phrase has at least 12 words."));
      return;
    }
    const problem = validatePasswords(password, confirm);
    if (problem) {
      setError(__(problem));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await wallet.import({
        password,
        mnemonic: cleanPhrase(phrase),
        scheme: check.bip39Valid ? scheme : "lbry",
      });
      clearSecrets();
      setStep("done");
      onWalletReady();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  async function useExisting() {
    const problem = validatePasswords(password, confirm);
    if (problem || !wallet.importLbrynet) {
      setError(problem ? __(problem) : __("This wallet cannot be imported here."));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await wallet.importLbrynet(password);
      clearSecrets();
      setStep("done");
      onWalletReady();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  function finishBackup() {
    setNewPhrase(null);
    setSaved(false);
    setStep("done");
    onWalletReady();
  }

  if (step === "loading" || step === "none" || step === "done") return null;

  const errorLine = error && <p className="error__text">{error}</p>;

  if (step === "error") {
    return (
      <Card
        title={__("Your wallet could not be opened")}
        subtitle={__("The wallet file was left untouched. Nothing has been changed or replaced.")}
        actions={errorLine}
      />
    );
  }

  if (step === "choose") {
    const usable = existing && existing.found && !existing.encrypted;
    return (
      <Card
        title={__("Set up your wallet")}
        subtitle={__(
          "Your wallet is created on this computer and protected by a password. You will get a recovery phrase: it is the only way to get your Credits back if this computer is lost."
        )}
        actions={
          <React.Fragment>
            {usable && (
              <p className="help">
                {__("We found a LBRY wallet on this computer (%name%). You can import it.", {
                  name: (existing && existing.name) || "",
                })}
              </p>
            )}
            {existing && existing.found && existing.encrypted && (
              <p className="help--warning">
                {__(
                  "We found a LBRY wallet on this computer, but it is protected with a password, so it cannot be brought in automatically. Restore it with its recovery phrase."
                )}
              </p>
            )}
            <div className="card__actions card__actions--wrap">
              {usable && (
                <Button
                  // @ts-expect-error - TS2322 (ts-migration)
                  button="primary"
                  label={__("Import my existing LBRY wallet")}
                  onClick={() => setStep("existing")}
                />
              )}
              <Button
                // @ts-expect-error - TS2322 (ts-migration)
                button={usable ? "secondary" : "primary"}
                label={__("Create a new wallet")}
                onClick={() => setStep("create")}
              />
              {/* @ts-expect-error - TS2322 (ts-migration) */}
              <Button button="secondary" label={__("I have a recovery phrase")} onClick={() => setStep("import")} />
            </div>
          </React.Fragment>
        }
      />
    );
  }

  if (step === "existing") {
    return (
      <Card
        title={__("Import my existing LBRY wallet")}
        subtitle={__(
          "This copies the recovery phrase of your LBRY wallet into a new wallet in this app, protected by a password you choose now. Your existing wallet file is not changed or deleted. It still holds your recovery phrase unprotected on disk."
        )}
        actions={
          // @ts-expect-error - TS2769 - No overload matches this call.
          <Form onSubmit={useExisting} className="section">
            <FormField
              autoFocus
              type="password"
              name="wallet_setup_password"
              label={__("Password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormField
              type="password"
              name="wallet_setup_password_confirm"
              label={__("Confirm password")}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            {errorLine}
            <div className="section__actions">
              <Button
                // @ts-expect-error - TS2322 (ts-migration)
                button="primary"
                type="submit"
                label={busy ? __("Importing...") : __("Import this wallet")}
                disabled={!password || !confirm || busy}
              />
              {/* @ts-expect-error - TS2322 (ts-migration) */}
              <Button button="link" label={__("Back")} onClick={back} disabled={busy} />
            </div>
          </Form>
        }
      />
    );
  }

  if (step === "create") {
    return (
      <Card
        title={__("Create a wallet")}
        subtitle={__(
          "Choose a password. It protects the wallet on this computer. It cannot be recovered, so you will need your recovery phrase if you forget it."
        )}
        actions={
          // @ts-expect-error - TS2769 - No overload matches this call.
          <Form onSubmit={create} className="section">
            <FormField
              autoFocus
              type="password"
              name="wallet_setup_password"
              label={__("Password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormField
              type="password"
              name="wallet_setup_password_confirm"
              label={__("Confirm password")}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            {errorLine}
            <div className="section__actions">
              <Button
                // @ts-expect-error - TS2322 (ts-migration)
                button="primary"
                type="submit"
                label={busy ? __("Creating...") : __("Create wallet")}
                disabled={!password || !confirm || busy}
              />
              {/* @ts-expect-error - TS2322 (ts-migration) */}
              <Button button="link" label={__("Back")} onClick={back} disabled={busy} />
            </div>
          </Form>
        }
      />
    );
  }

  if (step === "import") {
    const check = phrase.trim() ? checkPhrase(phrase) : null;
    return (
      <Card
        title={__("Restore a wallet")}
        subtitle={__("Enter the recovery phrase of a LBRY or Odysee wallet, then choose a password for this computer.")}
        actions={
          // @ts-expect-error - TS2769 - No overload matches this call.
          <Form onSubmit={importWallet} className="section">
            <FormField
              autoFocus
              type="textarea"
              name="wallet_setup_phrase"
              label={__("Recovery phrase")}
              placeholder={__("Enter your recovery phrase...")}
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
            />
            {check && check.unknownWords.length > 0 && (
              <p className="help--warning">
                {__("Unrecognized words: %words%. LBRY accepts any phrase, but double-check for typos.", {
                  words: check.unknownWords.join(", "),
                })}
              </p>
            )}
            {check && check.bip39Valid && (
              <FormField
                type="select"
                name="wallet_setup_scheme"
                label={__("This phrase is also a standard BIP39 phrase. Which wallet is it from?")}
                value={scheme}
                onChange={(e) => setScheme(e.target.value)}
              >
                <option value="lbry">{__("LBRY Desktop or Odysee")}</option>
                <option value="bip44">{__("A standard BIP39 wallet")}</option>
              </FormField>
            )}
            <FormField
              type="password"
              name="wallet_setup_password"
              label={__("Password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormField
              type="password"
              name="wallet_setup_password_confirm"
              label={__("Confirm password")}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            {errorLine}
            <div className="section__actions">
              <Button
                // @ts-expect-error - TS2322 (ts-migration)
                button="primary"
                type="submit"
                label={busy ? __("Restoring...") : __("Restore wallet")}
                disabled={!phrase.trim() || !password || !confirm || busy}
              />
              {/* @ts-expect-error - TS2322 (ts-migration) */}
              <Button button="link" label={__("Back")} onClick={back} disabled={busy} />
            </div>
          </Form>
        }
      />
    );
  }

  // step === "backup"
  return (
    <Card
      title={__("Write down your recovery phrase")}
      subtitle={__(
        "These words are your wallet. Anyone who has them can take your Credits, and without them a lost password or computer cannot be recovered. Write them down and keep them offline. They will not be shown again here."
      )}
      actions={
        <React.Fragment>
          <CopyableText copyable={newPhrase || ""} snackMessage={__("Recovery phrase copied.")} />
          <FormField
            type="checkbox"
            name="wallet_setup_saved"
            label={__("I have saved my recovery phrase")}
            // @ts-expect-error - TS2322 (ts-migration)
            checked={saved}
            onChange={() => setSaved(!saved)}
          />
          <div className="section__actions">
            {/* @ts-expect-error - TS2322 (ts-migration) */}
            <Button button="primary" label={__("Continue")} onClick={finishBackup} disabled={!saved} />
          </div>
        </React.Fragment>
      }
    />
  );
}
