// @flow
import { ALERT } from 'constants/icons';
import { SETTINGS_GRP } from 'constants/settings';
import React from 'react';
import Button from 'component/button';
import Card from 'component/common/card';
import { FormField } from 'component/common/form';
import FileSelector from 'component/common/file-selector';
import I18nMessage from 'component/i18nMessage';
import SettingAutoLaunch from 'component/settingAutoLaunch';
import SettingClosingBehavior from 'component/settingClosingBehavior';
import SettingsRow from 'component/settingsRow';
import SettingWalletServer from 'component/settingWalletServer';
import Spinner from 'component/spinner';
import { getPasswordFromCookie } from 'util/saved-passwords';

// @if TARGET='app'
const IS_MAC = process.platform === 'darwin';
// @endif

type Price = {
  currency: string,
  amount: number,
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
  ffmpegStatus: { available: boolean, which: string },
  findingFFmpeg: boolean,
  walletEncrypted: boolean,
  isAuthenticated: boolean,
  allowAnalytics: boolean,
  // --- perform ---
  setDaemonSetting: (string, ?SetDaemonSettingArg) => void,
  clearDaemonSetting: (string) => void,
  clearCache: () => Promise<any>,
  findFFmpeg: () => void,
  encryptWallet: () => void,
  decryptWallet: () => void,
  updateWalletStatus: () => void,
  confirmForgetPassword: ({}) => void,
  toggle3PAnalytics: (boolean) => void,
};

export default function SettingSystem(props: Props) {
  const {
    daemonSettings,
    ffmpegStatus,
    findingFFmpeg,
    walletEncrypted,
    isAuthenticated,
    allowAnalytics,
    setDaemonSetting,
    clearDaemonSetting,
    clearCache,
    findFFmpeg,
    encryptWallet,
    decryptWallet,
    updateWalletStatus,
    confirmForgetPassword,
    toggle3PAnalytics,
  } = props;

  const [clearingCache, setClearingCache] = React.useState(false);
  const [storedPassword, setStoredPassword] = React.useState(false);

  // @if TARGET='app'
  const { available: ffmpegAvailable, which: ffmpegPath } = ffmpegStatus;
  // @endif

  function onChangeEncryptWallet() {
    if (walletEncrypted) {
      decryptWallet();
    } else {
      encryptWallet();
    }
  }

  function onConfirmForgetPassword() {
    confirmForgetPassword({ callback: () => setStoredPassword(false) });
  }

  // Update ffmpeg variables
  React.useEffect(() => {
    // @if TARGET='app'
    const { available } = ffmpegStatus;
    const { ffmpeg_path: ffmpegPath } = daemonSettings;
    if (!available) {
      if (ffmpegPath) {
        clearDaemonSetting('ffmpeg_path');
      }
      findFFmpeg();
    }
    // @endif
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update storedPassword state
  React.useEffect(() => {
    if (isAuthenticated || !IS_WEB) {
      updateWalletStatus();
      getPasswordFromCookie().then((p) => {
        if (typeof p === 'string') {
          setStoredPassword(true);
        }
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="card__title-section">
        <h2 className="card__title">{__('System')}</h2>
      </div>
      <Card
        id={SETTINGS_GRP.SYSTEM}
        isBodyList
        body={
          <>
            {/* @if TARGET='app' */}
            <SettingsRow title={__('Download directory')} subtitle={__('LBRY downloads will be saved here.')}>
              <FileSelector
                type="openDirectory"
                currentPath={daemonSettings.download_dir}
                onFileChosen={(newDirectory: WebFile) => {
                  setDaemonSetting('download_dir', newDirectory.path);
                }}
              />
            </SettingsRow>
            {/* @endif */}

            {/* @if TARGET='app' */}
            <SettingsRow
              title={__('Save all viewed content to your downloads directory')}
              subtitle={__(
                'Paid content and some file types are saved by default. Changing this setting will not affect previously downloaded content.'
              )}
            >
              <FormField
                type="checkbox"
                name="save_files"
                onChange={() => setDaemonSetting('save_files', !daemonSettings.save_files)}
                checked={daemonSettings.save_files}
              />
            </SettingsRow>
            <SettingsRow
              title={__('Save hosting data to help the LBRY network')}
              subtitle={
                <React.Fragment>
                  {__("If disabled, LBRY will be very sad and you won't be helping improve the network.")}{' '}
                  <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/host-content" />.
                </React.Fragment>
              }
            >
              <FormField
                type="checkbox"
                name="save_blobs"
                onChange={() => setDaemonSetting('save_blobs', !daemonSettings.save_blobs)}
                checked={daemonSettings.save_blobs}
              />
            </SettingsRow>
            {/* @endif */}

            {/* @if TARGET='app' */}
            <SettingsRow
              title={__('Share usage and diagnostic data')}
              subtitle={
                <React.Fragment>
                  {__(
                    `This is information like error logging, performance tracking, and usage statistics. It includes your IP address and basic system details, but no other identifying information (unless you sign in to lbry.tv)`
                  )}{' '}
                  <Button button="link" label={__('Learn more')} href="https://odysee.com/$/privacypolicy" />
                </React.Fragment>
              }
              multirow
            >
              <FormField
                type="checkbox"
                name="share_internal"
                onChange={() => setDaemonSetting('share_usage_data', !daemonSettings.share_usage_data)}
                checked={daemonSettings.share_usage_data}
                label={<React.Fragment>{__('Allow the app to share data to LBRY.inc')}</React.Fragment>}
                helper={
                  isAuthenticated
                    ? __('Internal sharing is required while signed in.')
                    : __('Internal sharing is required to participate in rewards programs.')
                }
                disabled={isAuthenticated && daemonSettings.share_usage_data}
              />
              <FormField
                type="checkbox"
                name="share_third_party"
                onChange={(e) => toggle3PAnalytics(e.target.checked)}
                checked={allowAnalytics}
                label={__('Allow the app to access third party analytics platforms')}
                helper={__('We use detailed analytics to improve all aspects of the LBRY experience.')}
              />
            </SettingsRow>
            {/* @endif */}

            {/* @if TARGET='app' */}
            {/* Auto launch in a hidden state doesn't work on mac https://github.com/Teamwork/node-auto-launch/issues/81 */}
            {!IS_MAC && (
              <SettingsRow
                title={__('Start minimized')}
                subtitle={__(
                  'Improve view speed and help the LBRY network by allowing the app to cuddle up in your system tray.'
                )}
              >
                <SettingAutoLaunch noLabels />
              </SettingsRow>
            )}
            {/* @endif */}

            {/* @if TARGET='app' */}
            <SettingsRow title={__('Leave app running in notification area when the window is closed')}>
              <SettingClosingBehavior noLabels />
            </SettingsRow>
            {/* @endif */}

            {/* @if TARGET='app' */}
            <SettingsRow
              title={
                <span>
                  {__('Automatic transcoding')}
                  {findingFFmpeg && <Spinner type="small" />}
                </span>
              }
            >
              <FileSelector
                type="openDirectory"
                placeholder={__('A Folder containing FFmpeg')}
                currentPath={ffmpegPath || daemonSettings.ffmpeg_path}
                onFileChosen={(newDirectory: WebFile) => {
                  // $FlowFixMe
                  setDaemonSetting('ffmpeg_path', newDirectory.path);
                  findFFmpeg();
                }}
                disabled={Boolean(ffmpegPath)}
              />
              <p className="help">
                {ffmpegAvailable ? (
                  <I18nMessage
                    tokens={{
                      learn_more: (
                        <Button
                          button="link"
                          label={__('Learn more')}
                          href="https://odysee.com/@OdyseeHelp:b/uploadguide:1"
                        />
                      ),
                    }}
                  >
                    FFmpeg is correctly configured. %learn_more%
                  </I18nMessage>
                ) : (
                  <I18nMessage
                    tokens={{
                      check_again: (
                        <Button
                          button="link"
                          label={__('Check again')}
                          onClick={() => findFFmpeg()}
                          disabled={findingFFmpeg}
                        />
                      ),
                      learn_more: (
                        <Button
                          button="link"
                          label={__('Learn more')}
                          href="https://odysee.com/@OdyseeHelp:b/uploadguide:1"
                        />
                      ),
                    }}
                  >
                    FFmpeg could not be found. Navigate to it or Install, Then %check_again% or quit and restart the
                    app. %learn_more%
                  </I18nMessage>
                )}
              </p>
            </SettingsRow>
            {/* @endif */}

            {/* @if TARGET='app' */}
            <SettingsRow
              title={__('Encrypt my wallet with a custom password')}
              subtitle={
                <React.Fragment>
                  <I18nMessage
                    tokens={{
                      learn_more: (
                        <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/account-sync" />
                      ),
                    }}
                  >
                    Wallet encryption is currently unavailable until it's supported for synced accounts. It will be
                    added back soon. %learn_more%.
                  </I18nMessage>
                  {/* {__('Secure your local wallet data with a custom password.')}{' '}
                   <strong>{__('Lost passwords cannot be recovered.')} </strong>
                   <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/wallet-encryption" />. */}
                </React.Fragment>
              }
            >
              <FormField
                disabled
                type="checkbox"
                name="encrypt_wallet"
                onChange={() => onChangeEncryptWallet()}
                checked={walletEncrypted}
              />
            </SettingsRow>

            {walletEncrypted && storedPassword && (
              <SettingsRow
                title={__('Save wallet password')}
                subtitle={__('Automatically unlock your wallet on startup')}
              >
                <FormField
                  type="checkbox"
                  name="save_password"
                  onChange={onConfirmForgetPassword}
                  checked={storedPassword}
                />
              </SettingsRow>
            )}
            {/* @endif */}

            {/* @if TARGET='app' */}
            <SettingsRow
              title={__('Max connections')}
              subtitle={__(
                'For users with good bandwidth, try a higher value to improve streaming and download speeds. Low bandwidth users may benefit from a lower setting. Default is 4.'
              )}
            >
              {/* Disabling below until we get downloads to work with shared subscriptions code */}
              {/*
            <FormField
              type="checkbox"
              name="auto_download"
              onChange={() => setClientSetting(SETTINGS.AUTO_DOWNLOAD, !autoDownload)}
              checked={autoDownload}
              label={__('Automatically download new content from my subscriptions')}
              helper={__(
                "The latest file from each of your subscriptions will be downloaded for quick access as soon as it's published."
              )}
            />
            */}

              <fieldset-section>
                <FormField
                  name="max_connections"
                  type="select"
                  min={1}
                  max={100}
                  onChange={(e) => setDaemonSetting('max_connections_per_download', e.target.value)}
                  value={daemonSettings.max_connections_per_download}
                >
                  {[1, 2, 4, 6, 10, 20].map((connectionOption) => (
                    <option key={connectionOption} value={connectionOption}>
                      {connectionOption}
                    </option>
                  ))}
                </FormField>
              </fieldset-section>
            </SettingsRow>

            <SettingsRow title={__('Wallet server')} multirow>
              <SettingWalletServer />
            </SettingsRow>

            {/* @endif */}

            <SettingsRow
              title={__('Clear application cache')}
              subtitle={__('This might fix issues that you are having. Your wallet will not be affected.')}
            >
              <Button
                button="secondary"
                icon={ALERT}
                label={clearingCache ? __('Clearing') : __('Clear Cache')}
                onClick={() => {
                  setClearingCache(true);
                  clearCache();
                }}
                disabled={clearingCache}
              />
            </SettingsRow>
          </>
        }
      />
    </>
  );
}
