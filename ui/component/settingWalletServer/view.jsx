// @flow

import React, { useState, useEffect } from 'react';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import * as ICONS from 'constants/icons';

import ServerInputRow from './internal/inputRow';

type DaemonSettings = {
  lbryum_servers: Array<string>,
};

type DaemonStatus = {
  wallet: any,
};

type StatusOfServer = {
  host: string,
  port: string,
  availability: boolean,
  latency: number,
};

type ServerTuple = Array<string>; // ['host', 'port']
type ServerStatus = Array<StatusOfServer>;
type ServerConfig = Array<ServerTuple>;

type Props = {
  daemonSettings: DaemonSettings,
  getDaemonStatus: () => void,
  setCustomWalletServers: any => void,
  clearWalletServers: () => void,
  customWalletServers: ServerConfig,
  saveServerConfig: (Array<string>) => void,
  fetchDaemonSettings: () => void,
  hasWalletServerPrefs: boolean,
  daemonStatus: DaemonStatus,
};

function SettingWalletServer(props: Props) {
  const {
    daemonSettings,
    daemonStatus,
    fetchDaemonSettings,
    setCustomWalletServers,
    getDaemonStatus,
    clearWalletServers,
    saveServerConfig,
    customWalletServers,
    hasWalletServerPrefs,
  } = props;

  const [advancedMode, setAdvancedMode] = useState(false);

  const activeWalletServers: ServerStatus = (daemonStatus && daemonStatus.wallet && daemonStatus.wallet.servers) || [];
  const currentServerConfig: ServerConfig = daemonSettings && daemonSettings.lbryum_servers;
  const serverConfig: ServerConfig = customWalletServers.length ? customWalletServers : currentServerConfig;
  const STATUS_INTERVAL = 5000;

  useEffect(() => {
    if (hasWalletServerPrefs) {
      setAdvancedMode(true);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getDaemonStatus();
    }, STATUS_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchDaemonSettings();
  }, []);

  function makeServerParam(configList) {
    return configList.reduce((acc, cur) => {
      acc.push(`${cur[0]}:${cur[1]}`);
      return acc;
    }, []);
  }

  function doClear() {
    setAdvancedMode(false);
    clearWalletServers();
  }

  function onAdd(serverTuple: Array<string>) {
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
    setCustomWalletServers(makeServerParam(newConfig));
  }

  return (
    <React.Fragment>
      <fieldset-section>
        <FormField
          type="radio"
          name="default_wallet_servers"
          checked={!advancedMode}
          label={__('Use official lbry.tv wallet servers')}
          onChange={e => {
            if (e.target.checked) {
              doClear();
            }
          }}
        />
        <FormField
          type="radio"
          name="custom_wallet_servers"
          checked={advancedMode}
          onChange={e => {
            setAdvancedMode(e.target.checked);
            if (e.target.checked) {
              setCustomWalletServers(makeServerParam(customWalletServers));
            }
          }}
          label={__('Use custom wallet servers')}
        />
        {advancedMode && (
          <div>
            {serverConfig &&
              serverConfig.map((entry, index) => {
                const [host, port] = entry;
                const available = activeWalletServers.some(
                  s => s.host === entry[0] && String(s.port) === entry[1] && s.availability
                );

                return (
                  <div
                    key={`${host}:${port}`}
                    className="section section--padded card--inline form-field__internal-option"
                  >
                    <h3>
                      {host}:{port}
                    </h3>
                    <span className="help">{available ? 'Connected' : 'Not connected'}</span>
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
