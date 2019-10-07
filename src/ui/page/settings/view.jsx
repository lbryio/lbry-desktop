// @flow
/* eslint react/no-unescaped-entities:0 */
/* eslint react/jsx-no-comment-textnodes:0 */

import * as SETTINGS from 'constants/settings';
import * as PAGES from 'constants/pages';
import * as React from 'react';
import { FormField, FormFieldPrice } from 'component/common/form';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';
import Page from 'component/page';
import SettingLanguage from 'component/settingLanguage';
import FileSelector from 'component/common/file-selector';
import SyncToggle from 'component/syncToggle';
import Card from 'component/common/card';
import { getSavedPassword } from 'util/saved-passwords';

type Price = {
  currency: string,
  amount: number,
};

type SetDaemonSettingArg = boolean | string | number | Price;

type DarkModeTimes = {
  from: { hour: string, min: string, formattedTime: string },
  to: { hour: string, min: string, formattedTime: string },
};

type OptionTimes = {
  fromTo: string,
  time: string,
};

type DaemonSettings = {
  download_dir: string,
  share_usage_data: boolean,
  max_key_fee?: Price,
  max_connections_per_download?: number,
  save_files: boolean,
  save_blobs: boolean,
};

type Props = {
  setDaemonSetting: (string, ?SetDaemonSettingArg) => void,
  setClientSetting: (string, SetDaemonSettingArg) => void,
  clearCache: () => Promise<any>,
  daemonSettings: DaemonSettings,
  showNsfw: boolean,
  instantPurchaseEnabled: boolean,
  instantPurchaseMax: Price,
  currentTheme: string,
  themes: Array<string>,
  automaticDarkModeEnabled: boolean,
  autoplay: boolean,
  // autoDownload: boolean,
  encryptWallet: () => void,
  decryptWallet: () => void,
  updateWalletStatus: () => void,
  walletEncrypted: boolean,
  osNotificationsEnabled: boolean,
  supportOption: boolean,
  userBlockedChannelsCount?: number,
  hideBalance: boolean,
  confirmForgetPassword: ({}) => void,
  floatingPlayer: boolean,
  clearPlayingUri: () => void,
  darkModeTimes: DarkModeTimes,
  setDarkTime: (string, {}) => void,
};

type State = {
  clearingCache: boolean,
  storedPassword: boolean,
};

class SettingsPage extends React.PureComponent<Props, State> {
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
    (this: any).onChangeTime = this.onChangeTime.bind(this);
    (this: any).onConfirmForgetPassword = this.onConfirmForgetPassword.bind(this);
  }

  componentDidMount() {
    this.props.updateWalletStatus();
    getSavedPassword().then(p => {
      if (p) {
        this.setState({ storedPassword: true });
      }
    });
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

  onChangeTime(event: SyntheticInputEvent<*>, options: OptionTimes) {
    const { value } = event.target;

    this.props.setDarkTime(value, options);
  }

  to12Hour(time: string) {
    const now = new Date(0, 0, 0, Number(time));

    const hour = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit' });

    return hour;
  }

  setDaemonSetting(name: string, value: ?SetDaemonSettingArg): void {
    this.props.setDaemonSetting(name, value);
  }

  render() {
    const {
      daemonSettings,
      showNsfw,
      instantPurchaseEnabled,
      instantPurchaseMax,
      currentTheme,
      themes,
      automaticDarkModeEnabled,
      autoplay,
      walletEncrypted,
      osNotificationsEnabled,
      // autoDownload,
      setDaemonSetting,
      setClientSetting,
      supportOption,
      hideBalance,
      userBlockedChannelsCount,
      floatingPlayer,
      clearPlayingUri,
      darkModeTimes,
      clearCache,
    } = this.props;
    const { storedPassword } = this.state;

    const noDaemonSettings = !daemonSettings || Object.keys(daemonSettings).length === 0;

    const defaultMaxKeyFee = { currency: 'USD', amount: 50 };

    const disableMaxKeyFee = !(daemonSettings && daemonSettings.max_key_fee);
    const connectionOptions = [1, 2, 4, 6, 10, 20];
    const startHours = ['18', '19', '20', '21'];
    const endHours = ['5', '6', '7', '8'];

    return (
      <Page>
        {!IS_WEB && noDaemonSettings ? (
          <section className="card card--section">
            <div className="card__title">{__('Failed to load settings.')}</div>
          </section>
        ) : (
          <div>
            <Card title={__('Language')} actions={<SettingLanguage />} />
            <Card
              title={__('Sync')}
              subtitle={
                walletEncrypted && !storedPassword
                  ? __("To enable this feature, check 'Save Password' the next time you start the app.")
                  : null
              }
              actions={<SyncToggle disabled={walletEncrypted && !storedPassword} />}
            />
            {/* @if TARGET='app' */}
            <Card
              title={__('Download Directory')}
              actions={
                <React.Fragment>
                  <FileSelector
                    type="openDirectory"
                    currentPath={daemonSettings.download_dir}
                    onFileChosen={(newDirectory: WebFile) => {
                      setDaemonSetting('download_dir', newDirectory.path);
                    }}
                  />
                  <p className="help">{__('LBRY downloads will be saved here.')}</p>
                </React.Fragment>
              }
            />

            <Card
              title={__('Network and Data Settings')}
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
              title={__('Max Purchase Price')}
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

            <Card
              title={__('Purchase Confirmations')}
              actions={
                <React.Fragment>
                  <FormField
                    type="radio"
                    name="confirm_all_purchases"
                    checked={!instantPurchaseEnabled}
                    label={__('Always confirm before purchasing content')}
                    onChange={() => {
                      this.onInstantPurchaseEnabledChange(false);
                    }}
                  />
                  <FormField
                    type="radio"
                    name="instant_purchases"
                    checked={instantPurchaseEnabled}
                    label={__('Only confirm purchases over a certain price')}
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
                    {__("When this option is chosen, LBRY won't ask you to confirm downloads below your chosen price.")}
                  </p>
                </React.Fragment>
              }
            />

            {/* @endif */}
            <Card
              title={__('Content Settings')}
              actions={
                <React.Fragment>
                  <FormField
                    type="checkbox"
                    name="floating_player"
                    onChange={() => {
                      setClientSetting(SETTINGS.FLOATING_PLAYER, !floatingPlayer);
                      clearPlayingUri();
                    }}
                    checked={floatingPlayer}
                    label={__('Floating video player')}
                    helper={__('Keep content playing in the corner when navigating to a different page.')}
                  />

                  <FormField
                    type="checkbox"
                    name="autoplay"
                    onChange={() => setClientSetting(SETTINGS.AUTOPLAY, !autoplay)}
                    checked={autoplay}
                    label={__('Autoplay media files')}
                    helper={__(
                      'Autoplay video and audio files when navigating to a file, as well as the next related item when a file finishes playing.'
                    )}
                  />

                  {/* <FormField
                    type="checkbox"
                    name="show_anonymous"
                    onChange={() => setClientSetting(SETTINGS.SHOW_ANONYMOUS, !showAnonymous)}
                    checked={showAnonymous}
                    label={__('Show anonymous content')}
                    helper={__('Anonymous content is published without a channel.')}
                  /> */}

                  <FormField
                    type="checkbox"
                    name="show_nsfw"
                    onChange={() => setClientSetting(SETTINGS.SHOW_MATURE, !showNsfw)}
                    checked={showNsfw}
                    label={__('Show mature content')}
                    helper={__(
                      'Mature content may include nudity, intense sexuality, profanity, or other adult content. By displaying mature content, you are affirming you are of legal age to view mature content in your country or jurisdiction.  '
                    )}
                  />
                </React.Fragment>
              }
            />

            <Card
              title={__('Blocked Channels')}
              actions={
                <p>
                  {__('You have')} {userBlockedChannelsCount} {__('blocked')}{' '}
                  {userBlockedChannelsCount === 1 && __('channel')}
                  {userBlockedChannelsCount !== 1 && __('channels')}.{' '}
                  <Button button="link" label={__('Manage')} navigate={`/$/${PAGES.BLOCKED}`} />.
                </p>
              }
            />

            {/* @if TARGET='app' */}
            <Card
              title={__('Notifications')}
              actions={
                <FormField
                  type="checkbox"
                  name="desktopNotification"
                  onChange={() => setClientSetting(SETTINGS.OS_NOTIFICATIONS_ENABLED, !osNotificationsEnabled)}
                  checked={osNotificationsEnabled}
                  label={__('Show Desktop Notifications')}
                  helper={__('Get notified when a publish is confirmed, or when new content is available to watch.')}
                />
              }
            />
            <Card
              title={__('Share Diagnostic Data')}
              actions={
                <FormField
                  type="checkbox"
                  name="share_usage_data"
                  onChange={() => setDaemonSetting('share_usage_data', !daemonSettings.share_usage_data)}
                  checked={daemonSettings.share_usage_data}
                  label={
                    <React.Fragment>
                      {__('Help make LBRY better by contributing analytics and diagnostic data about my usage.')}{' '}
                      <Button button="link" label={__('Learn more')} href="https://lbry.com/privacypolicy" />.
                    </React.Fragment>
                  }
                  helper={__('You will be ineligible to earn rewards while diagnostics are not being shared.')}
                />
              }
            />
            {/* @endif */}

            <Card
              title={__('Appearance')}
              actions={
                <React.Fragment>
                  <fieldset-section>
                    <FormField
                      name="theme_select"
                      type="select"
                      label={__('Theme')}
                      onChange={this.onThemeChange}
                      value={currentTheme}
                      disabled={automaticDarkModeEnabled}
                    >
                      {themes.map(theme => (
                        <option key={theme} value={theme}>
                          {theme}
                        </option>
                      ))}
                    </FormField>
                  </fieldset-section>
                  <fieldset-section>
                    <FormField
                      type="checkbox"
                      name="automatic_dark_mode"
                      onChange={() => this.onAutomaticDarkModeChange(!automaticDarkModeEnabled)}
                      checked={automaticDarkModeEnabled}
                      label={__('Automatic dark mode')}
                    />
                    {automaticDarkModeEnabled && (
                      <fieldset-group class="fieldset-group--smushed">
                        <FormField
                          type="select"
                          name="automatic_dark_mode_range"
                          onChange={value => this.onChangeTime(value, { fromTo: 'from', time: 'hour' })}
                          value={darkModeTimes.from.hour}
                          label={__('From')}
                        >
                          {startHours.map(time => (
                            <option key={time} value={time}>
                              {this.to12Hour(time)}
                            </option>
                          ))}
                        </FormField>
                        <FormField
                          type="select"
                          name="automatic_dark_mode_range"
                          label={__('To')}
                          onChange={value => this.onChangeTime(value, { fromTo: 'to', time: 'hour' })}
                          value={darkModeTimes.to.hour}
                        >
                          {endHours.map(time => (
                            <option key={time} value={time}>
                              {this.to12Hour(time)}
                            </option>
                          ))}
                        </FormField>
                      </fieldset-group>
                    )}
                  </fieldset-section>
                </React.Fragment>
              }
            />
            <Card
              title={__('Wallet Security')}
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
                              <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/account-sync" />
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

                  {walletEncrypted && this.state.storedPassword && (
                    <FormField
                      type="checkbox"
                      name="save_password"
                      onChange={this.onConfirmForgetPassword}
                      checked={this.state.storedPassword}
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

            <Card
              title={__('Experimental Settings')}
              actions={
                <React.Fragment>
                  <FormField
                    type="checkbox"
                    name="support_option"
                    onChange={() => setClientSetting(SETTINGS.SUPPORT_OPTION, !supportOption)}
                    checked={supportOption}
                    label={__('Enable claim support')}
                    helper={
                      <I18nMessage
                        tokens={{
                          discovery_link: (
                            <Button button="link" label={__('discovery')} href="https://lbry.com/faq/trending" />
                          ),
                          vanity_names_link: (
                            <Button button="link" label={__('vanity names')} href="https://lbry.com/faq/naming" />
                          ),
                        }}
                      >
                        This will add a Support button along side tipping. Similar to tips, supports help
                        %discovery_link% but the LBC is returned to your wallet if revoked. Both also help secure your
                        %vanity_names_link%.
                      </I18nMessage>
                    }
                  />

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
                      {connectionOptions.map(connectionOption => (
                        <option key={connectionOption} value={connectionOption}>
                          {connectionOption}
                        </option>
                      ))}
                    </FormField>
                  </fieldset-section>
                  {/* @endif */}
                </React.Fragment>
              }
            />

            <Card
              title={__('Application Cache')}
              subtitle={
                <p className="card__subtitle--status">
                  {__(
                    'This will clear the application cache. Your wallet will not be affected. Currently, followed tags and blocked channels will be cleared.'
                  )}
                </p>
              }
              actions={
                <Button
                  button="inverse"
                  label={this.state.clearingCache ? __('Clearing') : __('Clear Cache')}
                  onClick={clearCache}
                  disabled={this.state.clearingCache}
                />
              }
            />
          </div>
        )}
      </Page>
    );
  }
}

export default SettingsPage;
