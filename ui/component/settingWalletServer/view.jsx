// @flow

import React, { useState, useEffect, useRef } from 'react';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import * as ICONS from 'constants/icons';
import ServerInputRow from './internal/inputRow';
import { stringifyServerParam } from 'util/sync-settings';

type StatusOfServer = {
  host: string,
  port: string,
  availability: boolean,
  latency: number,
};

type ServerTuple = [string, string]; // ['host', 'port']
type ServerStatus = Array<StatusOfServer>;
type ServerConfig = Array<ServerTuple>;
type DaemonStatus = {
  wallet: any,
};

type Props = {
  getDaemonStatus: () => void,
  setCustomWalletServers: (any) => void,
  clearWalletServers: () => void,
  customWalletServers: ServerConfig,
  saveServerConfig: (Array<ServerTuple>) => void,
  hasWalletServerPrefs: boolean,
  daemonStatus: DaemonStatus,
  walletReconnecting: boolean,
  walletRollbackToDefault: boolean,
  walletReconnectingToDefault: boolean,
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

  // onUnmount, if there are no available servers, doClear()
  // in order to replicate componentWillUnmount, the effect needs to get the value from a ref
  const hasAvailableRef = useRef();
  useEffect(
    () => () => {
      hasAvailableRef.current = availableServers;
    },
    [availableServers]
  );

  useEffect(
    () => () => {
      if (!hasAvailableRef.current) {
        doClear();
      }
    },
    []
  );

  useEffect(() => {
    if (hasWalletServerPrefs) {
      setUsingCustomServer(true);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getDaemonStatus();
    }, STATUS_INTERVAL);
    return () => clearInterval(interval);
  }, []);

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
    let newServerConfig = serverConfig.concat();
    newServerConfig.push(serverTuple);
    updateServers(newServerConfig);
  }

  function onDelete(i: number) {
    const newServerConfig = serverConfig.concat();
    newServerConfig.splice(i, 1);
    updateServers(newServerConfig);
  }

  function updateServers(newConfig) {
    saveServerConfig(newConfig);
    setCustomWalletServers(stringifyServerParam(newConfig));
  }

  return (
    <React.Fragment>
      <fieldset-section>
        <FormField
          type="radio"
          name="default_wallet_servers"
          checked={!usingCustomServer}
          label={__('Use official LBRY wallet servers')}
          onChange={(e) => {
            if (e.target.checked) {
              doClear();
            }
          }}
        />
        <FormField
          type="radio"
          name="custom_wallet_servers"
          checked={usingCustomServer}
          onChange={(e) => {
            setUsingCustomServer(e.target.checked);
            if (e.target.checked && customWalletServers.length) {
              setCustomWalletServers(stringifyServerParam(customWalletServers));
            }
          }}
          label={__('Use custom wallet servers')}
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
                        ? __('Connected')
                        : walletReconnecting && !walletReconnectingToDefault
                        ? __('Connecting...')
                        : __('Not connected')}
                    </span>
                    <Button
                      button="close"
                      title={__('Remove custom wallet server')}
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
      </fieldset-section>
    </React.Fragment>
  );
}

export default SettingWalletServer;
