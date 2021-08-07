// @flow
import * as React from 'react';

import { FormField } from 'component/common/form';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';
import Page from 'component/page';
import FileSelector from 'component/common/file-selector';
import { SETTINGS } from 'lbry-redux';
import Card from 'component/common/card';
import { getPasswordFromCookie } from 'util/saved-passwords';
import Spinner from 'component/spinner';

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
  clearDaemonSetting: (string) => void,
  setClientSetting: (string, SetDaemonSettingArg) => void,
  daemonSettings: DaemonSettings,
  isAuthenticated: boolean,
  encryptWallet: () => void,
  decryptWallet: () => void,
  updateWalletStatus: () => void,
  walletEncrypted: boolean,
  hideBalance: boolean,
  confirmForgetPassword: ({}) => void,
  ffmpegStatus: { available: boolean, which: string },
  findingFFmpeg: boolean,
  findFFmpeg: () => void,
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
    // this.props.setDaemonSetting(name, value);
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
      isAuthenticated,
      walletEncrypted,
      setClientSetting,
      hideBalance,
      findingFFmpeg,
    } = this.props;

    const { storedPassword } = this.state;
    const noDaemonSettings = !daemonSettings || Object.keys(daemonSettings).length === 0;
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
          </div>
        )}
      </Page>
    );
  }
}

export default SettingsAdvancedPage;
