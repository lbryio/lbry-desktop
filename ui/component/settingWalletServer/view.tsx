import React, { useState, useEffect, useRef } from "react";
import { FormField } from "component/common/form";
import Button from "component/button";
import * as ICONS from "constants/icons";
import ServerInputRow from "./internal/inputRow";
import { stringifyServerParam } from "util/sync-settings";

type StatusOfServer = {
  host: string;
  port: string;
  availability: boolean;
  latency: number;
};

type ServerTuple = [string, string]; // ['host', 'port']
type ServerStatus = Array<StatusOfServer>;
type ServerConfig = Array<ServerTuple>;
type DaemonStatus = {
  wallet: any;
};

type Props = {
  getDaemonStatus: () => void;
  setCustomWalletServers: (arg1?: any) => void;
  clearWalletServers: () => void;
  customWalletServers: ServerConfig;
  saveServerConfig: (arg1: Array<ServerTuple>) => void;
  hasWalletServerPrefs: boolean;
  daemonStatus: DaemonStatus;
  walletReconnecting: boolean;
  walletRollbackToDefault: boolean;
  walletReconnectingToDefault: boolean;
};

function SettingWalletServer(props: Props) {
  const {
    daemonStatus,
    setCustomWalletServers,
    getDaemonStatus,
    clearWalletServers,
    saveServerConfig,
    customWalletServers,
    hasWalletServerPrefs,
    walletReconnecting,
    walletRollbackToDefault,
    walletReconnectingToDefault,
  } = props;

  const [usingCustomServer, setUsingCustomServer] = useState(false);
  const [showCustomServers, setShowCustomServers] = useState(false);

  const walletStatus = daemonStatus && daemonStatus.wallet;
  const activeWalletServers: ServerStatus = (walletStatus && walletStatus.servers) || [];
  const availableServers = walletStatus && walletStatus.available_servers;
  const serverConfig: ServerConfig = customWalletServers;
  const STATUS_INTERVAL = 5000;

  // Latest values for the unmount cleanup below, which must not re-run on re-renders.
  const unmountStateRef = useRef({ availableServers, hasWalletServerPrefs, clearWalletServers });
  unmountStateRef.current = { availableServers, hasWalletServerPrefs, clearWalletServers };

  // On leaving the page, fall back to the official servers if custom ones are
  // configured and the daemon reports none of them reachable. Only on unmount:
  // this used to depend on `doClear` (a new function every render), so it fired
  // on every re-render and the 5s status poll below made it call
  // wallet_reconnect every ~5s, even on the official servers (#672).
  useEffect(
    () => () => {
      const { availableServers, hasWalletServerPrefs, clearWalletServers } = unmountStateRef.current;
      if (hasWalletServerPrefs && availableServers === 0) {
        clearWalletServers();
      }
    },
    []
  );

  useEffect(() => {
    if (hasWalletServerPrefs) {
      setUsingCustomServer(true);
    }
  }, [hasWalletServerPrefs]);

  useEffect(() => {
    const interval = setInterval(() => {
      getDaemonStatus();
    }, STATUS_INTERVAL);
    return () => clearInterval(interval);
  }, [getDaemonStatus]);

  // Once per rollback, not on every render while the flag is set (`doClear` is
  // a new function each render, so it can't be a dependency).
  useEffect(() => {
    if (walletRollbackToDefault) {
      doClear();
    }
  }, [walletRollbackToDefault]);

  useEffect(() => {
    if (usingCustomServer) {
      setShowCustomServers(true);
    }
  }, [usingCustomServer]);

  function doClear() {
    setUsingCustomServer(false);
    clearWalletServers();
  }

  function onAdd(serverTuple: ServerTuple) {
    const newServerConfig = serverConfig.concat();
    newServerConfig.push(serverTuple);
    updateServers(newServerConfig);
  }

  function onDelete(i: number) {
    const newServerConfig = serverConfig.concat();
    newServerConfig.splice(i, 1);
    updateServers(newServerConfig);
  }

  function updateServers(newConfig: unknown) {
    // @ts-expect-error - TS2345 - Argument of type 'unknown' is not assignable to parameter of type 'ServerTuple[]'.
    saveServerConfig(newConfig);
    setCustomWalletServers(stringifyServerParam(newConfig));
  }

  return (
    <React.Fragment>
      {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
      <fieldset-section>
        <FormField
          type="radio"
          name="default_wallet_servers"
          // @ts-expect-error - TS2322 - Type '{ type: string; name: string; checked: boolean; label: string; onChange: (e: any) => void; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
          checked={!usingCustomServer}
          label={__("Use official LBRY wallet servers")}
          onChange={(e) => {
            if (e.target.checked) {
              doClear();
            }
          }}
        />
        <FormField
          type="radio"
          name="custom_wallet_servers"
          // @ts-expect-error - TS2322 - Type '{ type: string; name: string; checked: boolean; onChange: (e: any) => void; label: string; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
          checked={usingCustomServer}
          onChange={(e) => {
            setUsingCustomServer(e.target.checked);
            if (e.target.checked && customWalletServers.length) {
              setCustomWalletServers(stringifyServerParam(customWalletServers));
            }
          }}
          label={__("Use custom wallet servers")}
        />

        {showCustomServers && (
          <div>
            {serverConfig &&
              serverConfig.map((entry, index) => {
                const [host, port] = entry;
                const available = activeWalletServers.some(
                  (s) => s.host === entry[0] && String(s.port) === entry[1] && s.availability
                );

                return (
                  <div
                    key={`${host}:${port}`}
                    className="section section--padded card--inline form-field__internal-option"
                  >
                    <h3>
                      {host}:{port}
                    </h3>
                    <span className="help">
                      {available
                        ? __("Connected")
                        : walletReconnecting && !walletReconnectingToDefault
                          ? __("Connecting...")
                          : __("Not connected")}
                    </span>
                    <Button
                      // @ts-expect-error - TS2322 (ts-migration)
                      button="close"
                      title={__("Remove custom wallet server")}
                      icon={ICONS.REMOVE}
                      onClick={() => onDelete(index)}
                    />
                  </div>
                );
              })}
            <div className="form-field__internal-option">
              <ServerInputRow update={onAdd} />
            </div>
          </div>
        )}
        {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
      </fieldset-section>
    </React.Fragment>
  );
}

export default SettingWalletServer;
