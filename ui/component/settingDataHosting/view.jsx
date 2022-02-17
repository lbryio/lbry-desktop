// @flow

import React from 'react';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import * as DAEMON_SETTINGS from 'constants/daemon_settings';
import { formatBytes } from 'util/format-bytes';
const BYTES_PER_MB = 1048576;
const ENABLE_AUTOMATIC_HOSTING = false;

type Price = {
  currency: string,
  amount: number,
};

type DaemonStatus = {
  disk_space: {
    content_blobs_storage_used_mb: string,
    published_blobs_storage_used_mb: string,
    running: true,
    seed_blobs_storage_used_mb: string,
    total_used_mb: string,
  },
};

type SetDaemonSettingArg = boolean | string | number | Price;

type DaemonSettings = {
  download_dir: string,
  share_usage_data: boolean,
  max_key_fee?: Price,
  max_connections_per_download?: number,
  save_files: boolean,
  save_blobs: boolean,
  ffmpeg_path: string,
};

type Props = {
  // --- select ---
  daemonSettings: DaemonSettings,
  daemonStatus: DaemonStatus,
  // --- perform ---
  setDaemonSetting: (string, ?SetDaemonSettingArg) => void,
  cleanBlobs: () => void,
};

function SettingWalletServer(props: Props) {
  const { daemonSettings, daemonStatus, setDaemonSetting, cleanBlobs } = props;

  const { disk_space } = daemonStatus;
  const contentSpaceUsed = Number(disk_space.content_blobs_storage_used_mb);
  const networkSpaceUsed = Number(disk_space.seed_blobs_storage_used_mb);
  const blobLimitSetting = daemonSettings[DAEMON_SETTINGS.BLOB_STORAGE_LIMIT_MB];
  const networkLimitSetting = daemonSettings[DAEMON_SETTINGS.NETWORK_STORAGE_LIMIT_MB];
  const [contentBlobSpaceLimitGB, setContentBlobSpaceLimit] = React.useState(
    blobLimitSetting ? blobLimitSetting / 1024 : 0
  );
  const [networkBlobSpaceLimitGB, setNetworkBlobSpaceLimit] = React.useState(
    networkLimitSetting ? networkLimitSetting / 1024 : 0
  );
  const [limitSpace, setLimitSpace] = React.useState(Boolean(blobLimitSetting));

  function updateContentBlobLimitField(gb) {
    if (gb === 0) {
      setContentBlobSpaceLimit(0);
    } else if (!gb || !isNaN(gb)) {
      setContentBlobSpaceLimit(gb);
    }
  }

  function updateNetworkBlobLimitField(gb) {
    if (gb === 0) {
      setNetworkBlobSpaceLimit(0);
    } else if (!gb || !isNaN(gb)) {
      setNetworkBlobSpaceLimit(gb);
    }
  }

  function handleLimitSpace(value) {
    setLimitSpace(value);
    if (!value) {
      setDaemonSetting(DAEMON_SETTINGS.BLOB_STORAGE_LIMIT_MB, String(0));
    } else {
      const spaceLimitMB = contentBlobSpaceLimitGB * 1024;
      setDaemonSetting(DAEMON_SETTINGS.BLOB_STORAGE_LIMIT_MB, String(spaceLimitMB));
    }
  }

  function handleSetContentBlobSpaceLimit() {
    const spaceLimitMB = contentBlobSpaceLimitGB * 1024;
    if (!isNaN(spaceLimitMB) && blobLimitSetting !== spaceLimitMB * 1024) {
      setDaemonSetting(DAEMON_SETTINGS.BLOB_STORAGE_LIMIT_MB, String(spaceLimitMB));
    }
  }

  function handleSetNetworkBlobSpaceLimit() {
    const spaceLimitMB = networkBlobSpaceLimitGB * 1024;
    if (!isNaN(spaceLimitMB) && blobLimitSetting !== spaceLimitMB * 1024) {
      setDaemonSetting(DAEMON_SETTINGS.NETWORK_STORAGE_LIMIT_MB, String(spaceLimitMB));
    }
  }

  return (
    <>
      <fieldset-section>
        <FormField
          type="checkbox"
          name="save_blobs"
          onChange={() => setDaemonSetting('save_blobs', !daemonSettings.save_blobs)}
          checked={daemonSettings.save_blobs}
          label={__('Enable Data Hosting')}
        />
      </fieldset-section>
      {daemonSettings.save_blobs && (
        <fieldset-section>
          <div className={'settings__row-section-title'}>{__('View History Hosting')}</div>
          <div className={'help'}>
            {`View History Hosting using ${formatBytes(contentSpaceUsed * BYTES_PER_MB)} of ${
              daemonSettings[DAEMON_SETTINGS.BLOB_STORAGE_LIMIT_MB]
                ? formatBytes(daemonSettings[DAEMON_SETTINGS.BLOB_STORAGE_LIMIT_MB] * BYTES_PER_MB)
                : 'Unlimited'
            }`}
          </div>
        </fieldset-section>
      )}
      {daemonSettings.save_blobs && (
        <fieldset-section>
          <FormField
            type="checkbox"
            name="limit_space_used"
            onChange={() => handleLimitSpace(!limitSpace)}
            checked={limitSpace}
            label={__('Limit Hosting of Content History')}
          />
        </fieldset-section>
      )}

      {daemonSettings.save_blobs && limitSpace && (
        <FormField
          name="content_blob_limit_gb"
          type="text"
          label={__(`Limit (GB)`)}
          disabled={!daemonSettings.save_blobs}
          onChange={(e) => updateContentBlobLimitField(e.target.value)}
          value={contentBlobSpaceLimitGB}
          inputButton={
            <Button
              disabled={isNaN(contentBlobSpaceLimitGB)}
              button="primary"
              label={__('Apply')}
              onClick={handleSetContentBlobSpaceLimit}
            />
          }
        />
      )}
      <fieldset-section>
        <Button type="button" button="inverse" onClick={cleanBlobs} label={__('Clean Now')} />
      </fieldset-section>
      {/* Automatic Hosting Section */}
      {daemonSettings.save_blobs && ENABLE_AUTOMATIC_HOSTING && (
        <fieldset-section>
          <div className={'settings__row-section-title'}>{__('Automatic Hosting - Experimental')}</div>
          <p className={'help'}>
            {`Automatic Hosting using ${formatBytes(networkSpaceUsed * BYTES_PER_MB)} of ${formatBytes(
              daemonSettings[DAEMON_SETTINGS.NETWORK_STORAGE_LIMIT_MB] * BYTES_PER_MB
            )}`}
          </p>
        </fieldset-section>
      )}
      {daemonSettings.save_blobs && ENABLE_AUTOMATIC_HOSTING && (
        <>
          <FormField
            name="network_blob_limit_gb"
            type="text"
            label={__(`Allow (GB)`)}
            disabled={!daemonSettings.save_blobs}
            onChange={(e) => updateNetworkBlobLimitField(e.target.value)}
            value={networkBlobSpaceLimitGB}
            inputButton={
              <Button
                disabled={isNaN(networkBlobSpaceLimitGB)}
                button="primary"
                label={__('Apply')}
                onClick={handleSetNetworkBlobSpaceLimit}
              />
            }
          />
          <div className="form-field__help">{__('Download and serve arbitrary data on the network.')}</div>
        </>
      )}
    </>
  );
}

export default SettingWalletServer;
