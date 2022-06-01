// @flow

import React from 'react';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import * as DAEMON_SETTINGS from 'constants/daemon_settings';
import { isTrulyANumber } from 'util/number';
import * as ICONS from 'constants/icons';
import * as KEYCODES from 'constants/keycodes';

import { convertGbToMbStr, isValidHostingAmount } from 'util/hosting';

type SetDaemonSettingArg = boolean | string | number;

type DaemonSettings = {
  save_blobs: boolean,
};

type Props = {
  // --- select ---
  daemonSettings: DaemonSettings,
  // --- perform ---
  setDaemonSetting: (string, ?SetDaemonSettingArg) => void,
  cleanBlobs: () => string,
  getDaemonStatus: () => void,
  isSetting: boolean,
};

function SettingDataHosting(props: Props) {
  const { daemonSettings, setDaemonSetting, cleanBlobs, getDaemonStatus, isSetting } = props;

  const networkLimitSetting = daemonSettings[DAEMON_SETTINGS.NETWORK_STORAGE_LIMIT_MB] || 0;
  const [networkBlobSpaceLimitGB, setNetworkBlobSpaceLimit] = React.useState(
    networkLimitSetting ? String(networkLimitSetting / 1024) : 0
  );

  function handleNetworkLimitChange(gb) {
    if (gb === '') {
      setNetworkBlobSpaceLimit('');
    } else {
      const numberGb = Number(gb);
      if (isTrulyANumber(numberGb)) {
        setNetworkBlobSpaceLimit(gb);
      }
    }
  }

  function handleKeyDown(e) {
    if (e.keyCode === KEYCODES.ESCAPE) {
      e.preventDefault();
      setNetworkBlobSpaceLimit(String(networkLimitSetting / 1024));
    } else if (e.keyCode === KEYCODES.ENTER) {
      e.preventDefault();
      handleApply();
    }
  }

  async function handleApply() {
    await setDaemonSetting(
      DAEMON_SETTINGS.NETWORK_STORAGE_LIMIT_MB,
      String(convertGbToMbStr(Number(networkBlobSpaceLimitGB)))
    );
    await cleanBlobs();
    getDaemonStatus();
  }

  return (
    <>
      <div className={'fieldset-section'}>
        <FormField
          name="network_blob_limit_gb"
          type="number"
          label={__(`Automatic Hosting (GB)`)}
          disabled={!daemonSettings.save_blobs || isSetting}
          onKeyDown={handleKeyDown}
          inputButton={
            <>
              <Button
                disabled={
                  // disabled if settings are equal or not valid amounts
                  String(networkLimitSetting) === convertGbToMbStr(networkBlobSpaceLimitGB) ||
                  !isValidHostingAmount(String(networkBlobSpaceLimitGB)) ||
                  isSetting ||
                  !daemonSettings.save_blobs
                }
                type="button"
                button="alt"
                onClick={handleApply}
                aria-label={__('Apply')}
                icon={ICONS.COMPLETE}
              />
              <Button
                disabled={
                  // disabled if settings are equal or not valid amounts
                  String(networkLimitSetting) === convertGbToMbStr(networkBlobSpaceLimitGB) ||
                  !isValidHostingAmount(String(networkBlobSpaceLimitGB)) ||
                  isSetting ||
                  !daemonSettings.save_blobs
                }
                type="button"
                button="alt"
                onClick={() => setNetworkBlobSpaceLimit(String(networkLimitSetting / 1024))}
                aria-label={__('Reset')}
                icon={ICONS.REMOVE}
              />
            </>
          }
          onChange={(e) => handleNetworkLimitChange(e.target.value)}
          value={networkBlobSpaceLimitGB}
        />
      </div>
    </>
  );
}

export default SettingDataHosting;
