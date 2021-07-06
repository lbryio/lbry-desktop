// @flow
import * as React from 'react';

import { FormField, FormFieldPrice } from 'component/common/form';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';
import Page from 'component/page';
import SettingWalletServer from 'component/settingWalletServer';
import SettingAutoLaunch from 'component/settingAutoLaunch';
import SettingClosingBehavior from 'component/settingClosingBehavior';
import FileSelector from 'component/common/file-selector';
import { SETTINGS } from 'lbry-redux';
import Card from 'component/common/card';
import { getPasswordFromCookie } from 'util/saved-passwords';
import Spinner from 'component/spinner';
import PublishSettings from 'component/publishSettings';

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
  setDaemonSetting: (string, ?SetDaemonSettingArg) => void,
  clearDaemonSetting: (string) => void,
  setClientSetting: (string, SetDaemonSettingArg) => void,
  daemonSettings: DaemonSettings,
  isAuthenticated: boolean,
  instantPurchaseEnabled: boolean,
  instantPurchaseMax: Price,
  encryptWallet: () => void,
  decryptWallet: () => void,
  updateWalletStatus: () => void,
  walletEncrypted: boolean,
  hideBalance: boolean,
  confirmForgetPassword: ({}) => void,
  ffmpegStatus: { available: boolean, which: string },
  findingFFmpeg: boolean,
  findFFmpeg: () => void,
  language?: string,
  syncEnabled: boolean,
  enterSettings: () => void,
  exitSettings: () => void,
};

type State = {
  clearingCache: boolean,
  storedPassword: boolean,
};

class SettingsAdvancedPage extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      clearingCache: false,
      storedPassword: false,
    };

    (this: any).onKeyFeeChange = this.onKeyFeeChange.bind(this);
    (this: any).onMaxConnectionsChange = this.onMaxConnectionsChange.bind(this);
    (this: any).onKeyFeeDisableChange = this.onKeyFeeDisableChange.bind(this);
    (this: any).onInstantPurchaseMaxChange = this.onInstantPurchaseMaxChange.bind(this);
    (this: any).onThemeChange = this.onThemeChange.bind(this);
    (this: any).onAutomaticDarkModeChange = this.onAutomaticDarkModeChange.bind(this);
    (this: any).onConfirmForgetPassword = this.onConfirmForgetPassword.bind(this);
  }

  componentDidMount() {
    const { isAuthenticated, ffmpegStatus, daemonSettings, findFFmpeg, enterSettings } = this.props;

    // @if TARGET='app'
    const { available } = ffmpegStatus;
    const { ffmpeg_path: ffmpegPath } = daemonSettings;
    if (!available) {
      if (ffmpegPath) {
        this.clearDaemonSetting('ffmpeg_path');
      }
      findFFmpeg();
    }
    // @endif

    if (isAuthenticated || !IS_WEB) {
      this.props.updateWalletStatus();
      getPasswordFromCookie().then((p) => {
        if (typeof p === 'string') {
          this.setState({ storedPassword: true });
        }
      });
    }
    enterSettings();
  }

  componentWillUnmount() {
    const { exitSettings } = this.props;
    exitSettings();
  }

  onFFmpegFolder(path: string) {
    this.setDaemonSetting('ffmpeg_path', path);
    this.findFFmpeg();
  }

  onKeyFeeChange(newValue: Price) {
    this.setDaemonSetting('max_key_fee', newValue);
  }

  onMaxConnectionsChange(event: SyntheticInputEvent<*>) {
    const { value } = event.target;
    this.setDaemonSetting('max_connections_per_download', value);
  }

  onKeyFeeDisableChange(isDisabled: boolean) {
    if (isDisabled) this.setDaemonSetting('max_key_fee');
  }

  onThemeChange(event: SyntheticInputEvent<*>) {
    const { value } = event.target;

    if (value === 'dark') {
      this.onAutomaticDarkModeChange(false);
    }

    this.props.setClientSetting(SETTINGS.THEME, value);
  }

  onAutomaticDarkModeChange(value: boolean) {
    this.props.setClientSetting(SETTINGS.AUTOMATIC_DARK_MODE_ENABLED, value);
  }

  onInstantPurchaseEnabledChange(enabled: boolean) {
    this.props.setClientSetting(SETTINGS.INSTANT_PURCHASE_ENABLED, enabled);
  }

  onInstantPurchaseMaxChange(newValue: Price) {
    this.props.setClientSetting(SETTINGS.INSTANT_PURCHASE_MAX, newValue);
  }

  onChangeEncryptWallet() {
    const { decryptWallet, walletEncrypted, encryptWallet } = this.props;
    if (walletEncrypted) {
      decryptWallet();
    } else {
      encryptWallet();
    }
  }

  onConfirmForgetPassword() {
    const { confirmForgetPassword } = this.props;
    confirmForgetPassword({
      callback: () => {
        this.setState({ storedPassword: false });
      },
    });
  }

  setDaemonSetting(name: string, value: ?SetDaemonSettingArg): void {
    this.props.setDaemonSetting(name, value);
  }

  clearDaemonSetting(name: string): void {
    this.props.clearDaemonSetting(name);
  }

  findFFmpeg(): void {
    this.props.findFFmpeg();
  }

  render() {
    const {
      daemonSettings,
      ffmpegStatus,
      instantPurchaseEnabled,
      instantPurchaseMax,
      isAuthenticated,
      walletEncrypted,
      setDaemonSetting,
      setClientSetting,
      hideBalance,
      findingFFmpeg,
      language,
    } = this.props;

    const { storedPassword } = this.state;
    const noDaemonSettings = !daemonSettings || Object.keys(daemonSettings).length === 0;
    const defaultMaxKeyFee = { currency: 'USD', amount: 50 };
    const disableMaxKeyFee = !(daemonSettings && daemonSettings.max_key_fee);
    const connectionOptions = [1, 2, 4, 6, 10, 20];
    // @if TARGET='app'
    const { available: ffmpegAvailable, which: ffmpegPath } = ffmpegStatus;
    // @endif

    return (
      <Page
        noFooter
        noSideNavigation
        backout={{
          title: __('Advanced settings'),
          backLabel: __('Done'),
        }}
        className="card-stack"
      >
        {!IS_WEB && noDaemonSettings ? (
          <section className="card card--section">
            <div className="card__title card__title--deprecated">{__('Failed to load settings.')}</div>
          </section>
        ) : (
          <div>
            {/* @if TARGET='app' */}
            <Card
              title={__('Network and data settings')}
              actions={
                <React.Fragment>
                  <FormField
                    type="checkbox"
                    name="save_files"
                    onChange={() => setDaemonSetting('save_files', !daemonSettings.save_files)}
                    checked={daemonSettings.save_files}
                    label={__('Save all viewed content to your downloads directory')}
                    helper={__(
                      'Paid content and some file types are saved by default. Changing this setting will not affect previously downloaded content.'
                    )}
                  />

                  <FormField
                    type="checkbox"
                    name="save_blobs"
                    onChange={() => setDaemonSetting('save_blobs', !daemonSettings.save_blobs)}
                    checked={daemonSettings.save_blobs}
                    label={__('Save hosting data to help the LBRY network')}
                    helper={
                      <React.Fragment>
                        {__("If disabled, LBRY will be very sad and you won't be helping improve the network.")}{' '}
                        <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/host-content" />.
                      </React.Fragment>
                    }
                  />
                </React.Fragment>
              }
            />

            <Card
              title={__('Max purchase price')}
              actions={
                <React.Fragment>
                  <FormField
                    type="radio"
                    name="no_max_purchase_no_limit"
                    checked={disableMaxKeyFee}
                    label={__('No Limit')}
                    onChange={() => {
                      this.onKeyFeeDisableChange(true);
                    }}
                  />
                  <FormField
                    type="radio"
                    name="max_purchase_limit"
                    checked={!disableMaxKeyFee}
                    onChange={() => {
                      this.onKeyFeeDisableChange(false);
                      this.onKeyFeeChange(defaultMaxKeyFee);
                    }}
                    label={__('Choose limit')}
                  />

                  {!disableMaxKeyFee && (
                    <FormFieldPrice
                      language={language}
                      name="max_key_fee"
                      min={0}
                      onChange={this.onKeyFeeChange}
                      price={daemonSettings.max_key_fee ? daemonSettings.max_key_fee : defaultMaxKeyFee}
                    />
                  )}

                  <p className="help">
                    {__('This will prevent you from purchasing any content over a certain cost, as a safety measure.')}
                  </p>
                </React.Fragment>
              }
            />
            {/* @endif */}

            <Card
              title={__('Purchase and tip confirmations')}
              actions={
                <React.Fragment>
                  <FormField
                    type="radio"
                    name="confirm_all_purchases"
                    checked={!instantPurchaseEnabled}
                    label={__('Always confirm before purchasing content or tipping')}
                    onChange={() => {
                      this.onInstantPurchaseEnabledChange(false);
                    }}
                  />
                  <FormField
                    type="radio"
                    name="instant_purchases"
                    checked={instantPurchaseEnabled}
                    label={__('Only confirm purchases or tips over a certain amount')}
                    onChange={() => {
                      this.onInstantPurchaseEnabledChange(true);
                    }}
                  />

                  {instantPurchaseEnabled && (
                    <FormFieldPrice
                      name="confirmation_price"
                      min={0.1}
                      onChange={this.onInstantPurchaseMaxChange}
                      price={instantPurchaseMax}
                    />
                  )}

                  <p className="help">
                    {__(
                      "When this option is chosen, LBRY won't ask you to confirm purchases or tips below your chosen amount."
                    )}
                  </p>
                </React.Fragment>
              }
            />

            {(isAuthenticated || !IS_WEB) && (
              <Card
                title={__('Wallet security')}
                actions={
                  <React.Fragment>
                    {/* @if TARGET='app' */}
                    <FormField
                      disabled
                      type="checkbox"
                      name="encrypt_wallet"
                      onChange={() => this.onChangeEncryptWallet()}
                      checked={walletEncrypted}
                      label={__('Encrypt my wallet with a custom password')}
                      helper={
                        <React.Fragment>
                          <I18nMessage
                            tokens={{
                              learn_more: (
                                <Button
                                  button="link"
                                  label={__('Learn more')}
                                  href="https://lbry.com/faq/account-sync"
                                />
                              ),
                            }}
                          >
                            Wallet encryption is currently unavailable until it's supported for synced accounts. It will
                            be added back soon. %learn_more%.
                          </I18nMessage>
                          {/* {__('Secure your local wallet data with a custom password.')}{' '}
                        <strong>{__('Lost passwords cannot be recovered.')} </strong>
                        <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/wallet-encryption" />. */}
                        </React.Fragment>
                      }
                    />

                    {walletEncrypted && storedPassword && (
                      <FormField
                        type="checkbox"
                        name="save_password"
                        onChange={this.onConfirmForgetPassword}
                        checked={storedPassword}
                        label={__('Save Password')}
                        helper={<React.Fragment>{__('Automatically unlock your wallet on startup')}</React.Fragment>}
                      />
                    )}
                    {/* @endif */}

                    <FormField
                      type="checkbox"
                      name="hide_balance"
                      onChange={() => setClientSetting(SETTINGS.HIDE_BALANCE, !hideBalance)}
                      checked={hideBalance}
                      label={__('Hide wallet balance in header')}
                    />
                  </React.Fragment>
                }
              />
            )}

            {/* @if TARGET='app' */}
            <Card
              title={
                <span>
                  {__('Automatic transcoding')}
                  {findingFFmpeg && <Spinner type="small" />}
                </span>
              }
              actions={
                <React.Fragment>
                  <FileSelector
                    type="openDirectory"
                    placeholder={__('A Folder containing FFmpeg')}
                    currentPath={ffmpegPath || daemonSettings.ffmpeg_path}
                    onFileChosen={(newDirectory: WebFile) => {
                      // $FlowFixMe
                      this.onFFmpegFolder(newDirectory.path);
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
                              href="https://lbry.com/faq/video-publishing-guide#automatic"
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
                              onClick={() => this.findFFmpeg()}
                              disabled={findingFFmpeg}
                            />
                          ),
                          learn_more: (
                            <Button
                              button="link"
                              label={__('Learn more')}
                              href="https://lbry.com/faq/video-publishing-guide#automatic"
                            />
                          ),
                        }}
                      >
                        FFmpeg could not be found. Navigate to it or Install, Then %check_again% or quit and restart the
                        app. %learn_more%
                      </I18nMessage>
                    )}
                  </p>
                </React.Fragment>
              }
            />
            {/* @endif */}
            {!IS_WEB && (
              <Card
                title={__('Experimental settings')}
                actions={
                  <React.Fragment>
                    {/* @if TARGET='app' */}
                    {/*
                  Disabling below until we get downloads to work with shared subscriptions code
                  <FormField
                    type="checkbox"
                    name="auto_download"
                    onChange={() => setClientSetting(SETTINGS.AUTO_DOWNLOAD, !autoDownload)}
                    checked={autoDownload}
                    label={__('Automatically download new content from my subscriptions')}
                    helper={__(
                      "The latest file from each of your subscriptions will be downloaded for quick access as soon as it's published."
                    )}
                  /> */}
                    <fieldset-section>
                      <FormField
                        name="max_connections"
                        type="select"
                        label={__('Max Connections')}
                        helper={__(
                          'For users with good bandwidth, try a higher value to improve streaming and download speeds. Low bandwidth users may benefit from a lower setting. Default is 4.'
                        )}
                        min={1}
                        max={100}
                        onChange={this.onMaxConnectionsChange}
                        value={daemonSettings.max_connections_per_download}
                      >
                        {connectionOptions.map((connectionOption) => (
                          <option key={connectionOption} value={connectionOption}>
                            {connectionOption}
                          </option>
                        ))}
                      </FormField>
                    </fieldset-section>
                    <SettingWalletServer />
                    {/* @endif */}
                  </React.Fragment>
                }
              />
            )}

            <Card title={__('Upload settings')} actions={<PublishSettings />} />

            {/* @if TARGET='app' */}
            {/* Auto launch in a hidden state doesn't work on mac https://github.com/Teamwork/node-auto-launch/issues/81 */}
            {!IS_MAC && <Card title={__('Startup preferences')} actions={<SettingAutoLaunch />} />}
            <Card title={__('Closing preferences')} actions={<SettingClosingBehavior />} />
            {/* @endif */}
          </div>
        )}
      </Page>
    );
  }
}

export default SettingsAdvancedPage;
