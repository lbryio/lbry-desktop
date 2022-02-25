// @flow

import React from 'react';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import * as DAEMON_SETTINGS from 'constants/daemon_settings';
import { formatBytes } from 'util/format-bytes';
import { isTrulyANumber } from 'util/number';
import I18nMessage from 'component/i18nMessage';
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
  cleanBlobs: () => string,
  diskSpace?: DiskSpace,
  getDaemonStatus: () => void,
};

function SettingDataHosting(props: Props) {
  const { daemonSettings, daemonStatus, setDaemonSetting, cleanBlobs, diskSpace, getDaemonStatus } = props;

  const { disk_space: blobSpace } = daemonStatus;
  const contentSpaceUsed = Number(blobSpace.content_blobs_storage_used_mb);
  const blobLimitSetting = daemonSettings[DAEMON_SETTINGS.BLOB_STORAGE_LIMIT_MB] || '0';
  const [contentBlobSpaceLimitGB, setContentBlobSpaceLimit] = React.useState(
    blobLimitSetting ? String(blobLimitSetting / 1024) : '10'
  );
  const [applying, setApplying] = React.useState(false);

  const networkSpaceUsed = Number(blobSpace.seed_blobs_storage_used_mb);
  const networkLimitSetting = daemonSettings[DAEMON_SETTINGS.NETWORK_STORAGE_LIMIT_MB] || '0';
  const [networkBlobSpaceLimitGB, setNetworkBlobSpaceLimit] = React.useState(
    networkLimitSetting ? String(networkLimitSetting / 1024) : '0'
  );

  const [unlimited, setUnlimited] = React.useState(blobLimitSetting === '0');

  React.useEffect(() => {
    getDaemonStatus();
  }, []);

  function convertGbToMb(gb) {
    return Number(gb) * 1024;
  }

  function handleContentLimitChange(gb) {
    if (gb === '') {
      setContentBlobSpaceLimit('');
    } else if (gb === '0') {
      setContentBlobSpaceLimit('0.01'); // setting 0 means unlimited.
    } else {
      if (isTrulyANumber(Number(gb))) {
        setContentBlobSpaceLimit(gb);
      }
    }
  }

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

  async function handleApply() {
    setApplying(true);
    if (unlimited) {
      await setDaemonSetting(DAEMON_SETTINGS.BLOB_STORAGE_LIMIT_MB, '0');
    } else {
      await setDaemonSetting(
        DAEMON_SETTINGS.BLOB_STORAGE_LIMIT_MB,
        String(contentBlobSpaceLimitGB === '0.01' ? '1' : convertGbToMb(contentBlobSpaceLimitGB))
      );
    }
    await setDaemonSetting(
      DAEMON_SETTINGS.NETWORK_STORAGE_LIMIT_MB,
      String(convertGbToMb(Number(networkBlobSpaceLimitGB)))
    );
    await cleanBlobs();
    getDaemonStatus();
    setApplying(false);
  }

  function validHostingAmount(amountString) {
    const numberAmount = Number(amountString);
    return amountString.length && ((numberAmount && String(numberAmount)) || numberAmount === 0);
  }

  return (
    <>
      <div className={'fieldset-section'}>
        <FormField
          type="checkbox"
          name="save_blobs"
          onChange={() => setDaemonSetting('save_blobs', !daemonSettings.save_blobs)}
          checked={daemonSettings.save_blobs}
          label={__('Enable Data Hosting')}
          helper={
            diskSpace && (
              <I18nMessage
                tokens={{
                  free: formatBytes(Number(diskSpace.free) * 1024, 0),
                  total: formatBytes(Number(diskSpace.total) * 1024, 0),
                }}
              >
                %free% of %total% available
              </I18nMessage>
            )
          }
        />
      </div>
      {daemonSettings.save_blobs && (
        <div className={'fieldset-section'}>
          <FormField
            type="radio"
            name="no_hosting_limit"
            checked={unlimited}
            label={__('Unlimited View Hosting')}
            onChange={() => setUnlimited(true)}
          />
          <FormField
            type="radio"
            name="set_hosting_limit"
            checked={!unlimited}
            onChange={() => setUnlimited(false)}
            label={__('Choose View Hosting Limit')}
          />
          {!unlimited && (
            <FormField
              name="content_blob_limit_gb"
              type="number"
              min={0}
              onWheel={(e) => e.preventDefault()}
              label={__(`View Hosting Limit (GB)`)}
              onChange={(e) => handleContentLimitChange(e.target.value)}
              value={Number(contentBlobSpaceLimitGB) <= Number('0.01') ? '0' : contentBlobSpaceLimitGB}
            />
          )}
          <div className={'help'}>{`Currently using ${formatBytes(contentSpaceUsed * BYTES_PER_MB)}`}</div>
        </div>
      )}
      {daemonSettings.save_blobs && ENABLE_AUTOMATIC_HOSTING && (
        <fieldset-section>
          <FormField
            name="network_blob_limit_gb"
            type="number"
            label={__(`Automatic Hosting (GB)`)}
            onChange={(e) => handleNetworkLimitChange(e.target.value)}
            value={networkBlobSpaceLimitGB}
          />
          <div className={'help'}>{`Auto-hosting ${formatBytes(networkSpaceUsed * BYTES_PER_MB)}`}</div>
        </fieldset-section>
      )}
      <div className={'card__actions'}>
        <Button
          disabled={
            (unlimited && blobLimitSetting === '0') ||
            (!unlimited &&
              (blobLimitSetting === convertGbToMb(contentBlobSpaceLimitGB) || // &&
                // networkLimitSetting === convertGbToMb(networkBlobSpaceLimitGB)
                !validHostingAmount(String(contentBlobSpaceLimitGB)))) ||
            applying
          }
          type="button"
          button="primary"
          onClick={handleApply}
          label={__('Apply')}
        />
      </div>
    </>
  );
}

export default SettingDataHosting;
