// @flow

import React, { useState, useEffect } from 'react';
import { FormField } from 'component/common/form';
import ServerInputRow from './internal/inputRow';
import ServerDisplayRow from './internal/displayRow';

type DaemonSettings = {
  lbryum_servers: Array<>
};

type StatusOfServer = {
  host: string,
  port: string,
  availability: boolean,
  latency: number,
}

type ServerInConfig = Array<string> // ['host', 'port']

type DisplayOfServer = {
  host: string,
  port: string,
  availability: boolean,
}

type ServerStatus = Array<StatusOfServer>
type ServerConfig = Array<ServerInConfig>
type DisplayList = Array<DisplayOfServer>

type Props = {
  daemonSettings: DaemonSettings,
  getDaemonStatus: () => void,
  setWalletServers: any => void,
  clearWalletServers: () => void,
  customServers: ServerConfig,
  saveServers: string => void,
  fetchDaemonSettings: () => void,
  serverPrefs: ServerConfig,
};

function SettingWalletServer(props: Props) {
  const {
    daemonSettings,
    fetchDaemonSettings,
    setWalletServers,
    getDaemonStatus,
    clearWalletServers,
    saveServers,
    customServers,
    serverPrefs,
  } = props;

  const [custom, setCustom] = useState(false);
  const [status, setStatus] = useState([]);
  const serversInConfig: ServerConfig = daemonSettings && daemonSettings.lbryum_servers;
  const servers = customServers.length ? customServers : serversInConfig;
  const STATUS_INTERVAL = 5000;

  useEffect(() => {
    if (serverPrefs && serverPrefs.length) {
      setCustom(true);
    }
  }, []);

  // TODO: do this globally to have status updated for the app
  useEffect(() => {
    const interval = setInterval(() => {
      getDaemonStatus()
        .then(s => {
          if (s && s.wallet && s.wallet.servers) {
            setStatus(s.wallet.servers);
          }
        });
    }, STATUS_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchDaemonSettings();
  }, [custom]);

  function makeDisplayList(l) {
    const displayList = [];
    l.forEach(entry => {
      displayList.push({
        host: entry[0],
        port: entry[1],
        available:
          (status && status.some(s => s.host === entry[0] && String(s.port) === entry[1] && s.availability)) ||
          false,
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
    setCustom(false);
    clearWalletServers();
  }

  function onAdd(serverTuple) {
    let newServerConfig = servers.concat();
    newServerConfig.push(serverTuple);
    saveServers(newServerConfig);
    setWalletServers(makeServerParam(newServerConfig));
  }

  function onDelete(i) {
    const newServerList = servers.concat();
    newServerList.splice(i, 1);
    saveServers(newServerList);
    setWalletServers(makeServerParam(newServerList));
  }

  return (
    <React.Fragment>
      <FormField
        type="radio"
        name="default_wallet_servers"
        checked={!custom}
        label={__('lbry.tv wallet servers')}
        onChange={e => {
          if (e.target.checked) {
            doClear();
          }
        }}
      />
      <FormField
        type="radio"
        name="custom_wallet_servers"
        checked={custom}
        onChange={e => {
          setCustom(e.target.checked);
          if (e.target.checked) {
            setWalletServers(makeServerParam(customServers));
          }
        }}
        label={__('Custom wallet servers')}
      />
      {custom && (
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
              {servers &&
                makeDisplayList(servers).map((t, i) => (
                  <ServerDisplayRow key={`${t.host}:${t.port}`} host={t.host} port={t.port} available={t.available} index={i} remove={onDelete} />
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
