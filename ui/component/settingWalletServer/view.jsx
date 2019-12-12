// @flow

import React, { useState, useEffect } from 'react';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import * as ICONS from 'constants/icons';
import Icon from 'component/common/icon';

import ServerInputRow from './internal/inputRow';

type DaemonSettings = {
  lbryum_servers: Array<>,
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

type DisplayOfServer = {
  host: string,
  port: string,
  availability: boolean,
};

type ServerStatus = Array<StatusOfServer>;
type ServerConfig = Array<ServerTuple>;
type DisplayList = Array<DisplayOfServer>;

type Props = {
  daemonSettings: DaemonSettings,
  getDaemonStatus: () => void,
  setCustomWalletServers: any => void,
  clearWalletServers: () => void,
  customWalletServers: ServerConfig,
  saveServerConfig: string => void,
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
  console.log(hasWalletServerPrefs)

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

  function makeDisplayList(l) {
    const displayList = [];
    l.forEach(entry => {
      displayList.push({
        host: entry[0],
        port: entry[1],
        available:
          activeWalletServers.some(s => s.host === entry[0] && String(s.port) === entry[1] && s.availability) || false,
      });
    });
    return displayList;
  }

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

  function onAdd(serverTuple) {
    let newServerConfig = serverConfig.concat();
    newServerConfig.push(serverTuple);
    updateServers(newServerConfig);
  }

  function onDelete(i) {
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
      <label>{__('Wallet servers')}</label>
      <fieldset>
      <FormField
        type="radio"
        name="default_wallet_servers"
        checked={!advancedMode}
        label={__('lbry.tv')}
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
        label={__('customize')}
      />
      </fieldset>
      {advancedMode && (
        <div>
          <table className="table table--transactions">
            <thead>
              <tr>
                <th>{__('Host')}</th>
                <th>{__('Port')} </th>
                <th>{__('Available')} </th>
                <th>{__('Add/Delete')} </th>
              </tr>
            </thead>
            <tbody>
              {serverConfig &&
                makeDisplayList(serverConfig).map((t, i) => (
                  <tr key={`${t.host}:${t.port}`}>
                    <td>{t.host}</td>
                    <td>{t.port}</td>
                    <td>{t.available && <Icon icon={ICONS.SUBSCRIBE} />}</td>
                    <td>
                      <Button button={'link'} icon={ICONS.REMOVE} onClick={() => onDelete(i)} />
                    </td>
                  </tr>
                ))}
              <ServerInputRow update={onAdd} />
            </tbody>
          </table>
        </div>
      )}
      <p className="help">{__(`Choose a different provider's wallet server.`)}</p>
    </React.Fragment>
  );
}

export default SettingWalletServer;
