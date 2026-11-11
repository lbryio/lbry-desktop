import * as React from "react";
import Lbry from "lbry";
import Button from "component/button";
import Card from "component/common/card";
import CopyableText from "component/copyableText";
import { FormField, Form } from "component/common/form";
import { checkPhrase, cleanPhrase } from "util/wallet/mnemonic";

type RevealState = "hidden" | "confirming" | "revealed";

export default function WalletSeed() {
  // --- Reveal / export ---------------------------------------------------
  const [revealState, setRevealState] = React.useState<RevealState>("hidden");
  const [seed, setSeed] = React.useState<string | null>(null);
  const [revealError, setRevealError] = React.useState<string | null>(null);

  async function revealSeed() {
    setRevealError(null);
    try {
      const walletStatus = await Lbry.wallet_status();
      if (walletStatus && walletStatus.is_locked) {
        setRevealError(__("Your wallet is locked. Unlock it first, then try again."));
        return;
      }
      const accounts = await (Lbry as any).account_list({ include_seed: true });
      const items = (accounts && accounts.items) || [];
      const defaultAccount = items.find((a: any) => a.is_default) || items[0];
      if (defaultAccount && defaultAccount.seed) {
        setSeed(defaultAccount.seed);
        setRevealState("revealed");
      } else {
        setRevealError(__("The daemon did not return a seed for this wallet."));
      }
    } catch (err: any) {
      setRevealError(String((err && err.message) || err));
    }
  }

  function hideSeed() {
    setSeed(null);
    setRevealState("hidden");
  }

  // --- Import ------------------------------------------------------------
  const [importPhrase, setImportPhrase] = React.useState("");
  const [importing, setImporting] = React.useState(false);
  const [importResult, setImportResult] = React.useState<string | null>(null);
  const [importError, setImportError] = React.useState<string | null>(null);

  const phraseCheck = importPhrase.trim() ? checkPhrase(importPhrase) : null;

  async function importSeed() {
    setImporting(true);
    setImportError(null);
    setImportResult(null);
    try {
      const account = await (Lbry as any).account_add({
        account_name: __("Imported account"),
        seed: cleanPhrase(importPhrase),
      });
      if (account && account.id) {
        setImportResult(
          __("Account %account_id% imported. Balances and claims will appear once the wallet finishes syncing.", {
            account_id: account.id,
          })
        );
        setImportPhrase("");
      } else {
        setImportError(__("The daemon did not confirm the import."));
      }
    } catch (err: any) {
      setImportError(String((err && err.message) || err));
    } finally {
      setImporting(false);
    }
  }

  return (
    <React.Fragment>
      <Card
        title={__("Your seed phrase")}
        subtitle={__(
          "The seed phrase is the master key to your LBRY wallet: anyone who has it controls your Credits, channels, and publishes. Write it down and store it somewhere safe — never share it, and never enter it on a website."
        )}
        actions={
          <React.Fragment>
            {revealState === "hidden" && (
              <Button
                // @ts-expect-error - TS2322 (ts-migration)
                button="secondary"
                label={__("Reveal seed phrase")}
                onClick={() => setRevealState("confirming")}
              />
            )}
            {revealState === "confirming" && (
              <React.Fragment>
                <p className="help--warning">
                  {__("Make sure nobody can see your screen. Your seed phrase will be displayed in plain text.")}
                </p>
                <div className="section__actions">
                  {/* @ts-expect-error - TS2322 (ts-migration) */}
                  <Button button="primary" label={__("Show it")} onClick={revealSeed} />
                  {/* @ts-expect-error - TS2322 (ts-migration) */}
                  <Button button="link" label={__("Cancel")} onClick={hideSeed} />
                </div>
              </React.Fragment>
            )}
            {revealState === "revealed" && seed && (
              <React.Fragment>
                <CopyableText copyable={seed} snackMessage={__("Seed phrase copied.")} />
                <p className="help--warning">
                  {__("Anyone with these words can take your Credits. Store them offline.")}
                </p>
                {/* @ts-expect-error - TS2322 (ts-migration) */}
                <Button button="link" label={__("Hide")} onClick={hideSeed} />
              </React.Fragment>
            )}
            {revealError && <p className="error__text">{revealError}</p>}
          </React.Fragment>
        }
      />

      <Card
        title={__("Import a wallet from a seed phrase")}
        subtitle={__(
          "Restore an existing LBRY wallet by entering its seed phrase. The imported account is added alongside your current one."
        )}
        actions={
          <Form onSubmit={importSeed}>
            <FormField
              type="textarea"
              name="wallet_seed_import"
              placeholder={__("Enter your seed phrase...")}
              value={importPhrase}
              onChange={(e) => setImportPhrase(e.target.value)}
            />
            {phraseCheck && phraseCheck.unknownWords.length > 0 && (
              <p className="help--warning">
                {__("Unrecognized words: %words%. LBRY accepts any phrase, but double-check for typos.", {
                  words: phraseCheck.unknownWords.join(", "),
                })}
              </p>
            )}
            <div className="section__actions">
              <Button
                // @ts-expect-error - TS2322 (ts-migration)
                button="primary"
                type="submit"
                disabled={importing || !importPhrase.trim()}
                label={importing ? __("Importing...") : __("Import wallet")}
              />
            </div>
            {importResult && <p className="help">{importResult}</p>}
            {importError && <p className="error__text">{importError}</p>}
          </Form>
        }
      />
    </React.Fragment>
  );
}
