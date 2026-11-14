import * as React from "react";
// @ts-expect-error - TS2792 - Cannot find module 'electron'. Did you mean to set the 'moduleResolution' option to 'node', or to add aliases to the 'paths' option?
import { ipcRenderer } from "electron";
import Button from "component/button";
import Card from "component/common/card";
import { FormField, Form } from "component/common/form";
import { localWallet } from "util/wallet/localWallet";

type Status = { exists: boolean; locked: boolean; error?: string; autoLockAt?: number };

// The operations this needs from the wallet in the main process (see ui/util/wallet/localWallet).
export type LockApi = {
  status: () => Promise<Status>;
  unlock: (password: string) => Promise<Status>;
  lock: () => Promise<Status>;
};

type Props = {
  // Only tests pass these.
  wallet?: LockApi;
  // Calls back when the main process locks or unlocks the wallet (it also locks itself when idle).
  subscribe?: (listener: (status: Status) => void) => () => void;
};

const errorText = (e: any) => String((e && e.message) || e);

function subscribeToMainProcess(listener: (status: Status) => void) {
  const handler = (_event: unknown, status: Status) => listener(status);
  ipcRenderer.on("wallet:lockChanged", handler);
  return () => ipcRenderer.removeListener("wallet:lockChanged", handler);
}

export default function WalletLock(props: Props) {
  const wallet = React.useMemo<LockApi>(() => props.wallet || (localWallet(ipcRenderer) as LockApi), [props.wallet]);
  const subscribe = props.subscribe || subscribeToMainProcess;

  const [status, setStatus] = React.useState<Status | null>(null);
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    wallet
      .status()
      .then((s) => active && setStatus(s))
      .catch(() => {});
    const stop = subscribe((s) => {
      if (!active) return;
      setStatus(s);
      if (!s.locked) setPassword("");
    });
    return () => {
      active = false;
      stop();
    };
  }, [wallet, subscribe]);

  async function unlock() {
    setBusy(true);
    setError(null);
    try {
      setStatus(await wallet.unlock(password));
      setPassword("");
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  async function lock() {
    setBusy(true);
    setError(null);
    try {
      setStatus(await wallet.lock());
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  // Nothing to lock until a wallet exists, and an unreadable one is the setup card's to report.
  if (!status || !status.exists || status.error) return null;

  const errorLine = error && <p className="error__text">{error}</p>;

  if (!status.locked) {
    return (
      <Card
        title={__("Wallet unlocked")}
        subtitle={__("Your wallet locks itself after a while without use. Lock it now if you are stepping away.")}
        actions={
          <React.Fragment>
            {errorLine}
            <div className="card__actions">
              {/* @ts-expect-error - TS2322 (ts-migration) */}
              <Button button="secondary" label={__("Lock wallet")} onClick={lock} disabled={busy} />
            </div>
          </React.Fragment>
        }
      />
    );
  }

  return (
    <Card
      title={__("Wallet locked")}
      subtitle={__("Receiving works while the wallet is locked. Enter your password to spend or sign.")}
      actions={
        // @ts-expect-error - TS2769 - No overload matches this call.
        <Form onSubmit={unlock} className="section">
          <FormField
            type="password"
            name="wallet_lock_password"
            label={__("Password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorLine}
          <div className="section__actions">
            <Button
              // @ts-expect-error - TS2322 (ts-migration)
              button="primary"
              type="submit"
              label={busy ? __("Unlocking...") : __("Unlock wallet")}
              disabled={!password || busy}
            />
          </div>
        </Form>
      }
    />
  );
}
