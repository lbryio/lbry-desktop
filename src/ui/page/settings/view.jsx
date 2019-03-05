// @flow
import * as ICONS from 'constants/icons';
import * as SETTINGS from 'constants/settings';
import * as React from 'react';
import { FormField, FormFieldPrice, Form } from 'component/common/form';
import Button from 'component/button';
import Page from 'component/page';
import FileSelector from 'component/common/file-selector';

export type Price = {
  currency: string,
  amount: number,
};

type SetDaemonSettingArg = boolean | string | number | Price;

type DaemonSettings = {
  download_dir: string,
  share_usage_data: boolean,
  max_key_fee?: Price,
};

type Props = {
  setDaemonSetting: (string, ?SetDaemonSettingArg) => void,
  setClientSetting: (string, SetDaemonSettingArg) => void,
  clearCache: () => Promise<any>,
  getThemes: () => void,
  daemonSettings: DaemonSettings,
  showNsfw: boolean,
  instantPurchaseEnabled: boolean,
  instantPurchaseMax: Price,
  currentTheme: string,
  themes: Array<string>,
  automaticDarkModeEnabled: boolean,
  autoplay: boolean,
  autoDownload: boolean,
  encryptWallet: () => void,
  decryptWallet: () => void,
  updateWalletStatus: () => void,
  walletEncrypted: boolean,
  osNotificationsEnabled: boolean,
};

type State = {
  clearingCache: boolean,
};

class SettingsPage extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      clearingCache: false,
    };

    (this: any).onKeyFeeChange = this.onKeyFeeChange.bind(this);
    (this: any).onKeyFeeDisableChange = this.onKeyFeeDisableChange.bind(this);
    (this: any).onInstantPurchaseMaxChange = this.onInstantPurchaseMaxChange.bind(this);
    (this: any).onThemeChange = this.onThemeChange.bind(this);
    (this: any).onAutomaticDarkModeChange = this.onAutomaticDarkModeChange.bind(this);
    (this: any).clearCache = this.clearCache.bind(this);
  }

  componentDidMount() {
    this.props.getThemes();
    this.props.updateWalletStatus();
  }

  onKeyFeeChange(newValue: Price) {
    this.setDaemonSetting('max_key_fee', newValue);
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

  setDaemonSetting(name: string, value: ?SetDaemonSettingArg): void {
    this.props.setDaemonSetting(name, value);
  }

  clearCache() {
    this.setState({
      clearingCache: true,
    });
    const success = () => {
      this.setState({ clearingCache: false });
      window.location.href = 'index.html';
    };
    const clear = () => this.props.clearCache().then(success);

    setTimeout(clear, 1000, { once: true });
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
      autoDownload,
      setDaemonSetting,
      setClientSetting,
    } = this.props;

    const noDaemonSettings = !daemonSettings || Object.keys(daemonSettings).length === 0;
    const isDarkModeEnabled = currentTheme === 'dark';

    const defaultMaxKeyFee = { currency: 'USD', amount: 50 };
    const disableMaxKeyFee = !(daemonSettings && daemonSettings.max_key_fee);

    return (
      <Page>
        {noDaemonSettings ? (
          <section className="card card--section">
            <div className="card__title">{__('Failed to load settings.')}</div>
          </section>
        ) : (
          <React.Fragment>
            <section className="card card--section">
              <header className="card__header">
                <h2 className="card__title">{__('Download Directory')}</h2>
                <p className="card__subtitle">{__('LBRY downloads will be saved here.')}</p>
              </header>

              <div className="card__content">
                <Form>
                  <FileSelector
                    type="openDirectory"
                    currentPath={daemonSettings.download_dir}
                    onFileChosen={(newDirectory: string) => {
                      setDaemonSetting('download_dir', newDirectory);
                    }}
                  />
                </Form>
              </div>
            </section>

            <section className="card card--section">
              <header className="card__header">
                <h2 className="card__title">{__('Max Purchase Price')}</h2>
                <p className="card__subtitle">
                  {__(
                    'This will prevent you from purchasing any content over a certain cost, as a safety measure.'
                  )}
                </p>
              </header>

              <Form className="card__content">
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
                    price={
                      daemonSettings.max_key_fee ? daemonSettings.max_key_fee : defaultMaxKeyFee
                    }
                  />
                )}
              </Form>
            </section>

            <section className="card card--section">
              <header className="card__header">
                <h2 className="card__title">{__('Purchase Confirmations')}</h2>
                <p className="card__subtitle">
                  {__(
                    "When this option is chosen, LBRY won't ask you to confirm downloads below your chosen price."
                  )}
                </p>
              </header>

              <Form className="card__content">
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
              </Form>
            </section>

            <section className="card card--section">
              <header className="card__header">
                <h2 className="card__title">{__('Content Settings')}</h2>
              </header>

              <Form className="card__content">
                <FormField
                  type="setting"
                  name="show_nsfw"
                  onChange={() => setClientSetting(SETTINGS.SHOW_NSFW, !showNsfw)}
                  checked={showNsfw}
                  label={__('Show NSFW content')}
                  helper={__(
                    'NSFW content may include nudity, intense sexuality, profanity, or other adult content. By displaying NSFW content, you are affirming you are of legal age to view mature content in your country or jurisdiction.  '
                  )}
                />
              </Form>
            </section>

            <section className="card card--section">
              <header className="card__header">
                <h2 className="card__title">{__('Notifications')}</h2>
              </header>
              <Form className="card__content">
                <FormField
                  type="setting"
                  name="desktopNotification"
                  onChange={() =>
                    setClientSetting(SETTINGS.OS_NOTIFICATIONS_ENABLED, !osNotificationsEnabled)
                  }
                  checked={osNotificationsEnabled}
                  label={__('Show Desktop Notifications')}
                  helper={__(
                    'Get notified when a publish is confirmed, or when new content is available to watch.'
                  )}
                />
              </Form>
            </section>

            <section className="card card--section">
              <header className="card__header">
                <h2 className="card__title">{__('Share Diagnostic Data')}</h2>
              </header>

              <Form className="card__content">
                <FormField
                  type="setting"
                  name="share_usage_data"
                  onChange={() =>
                    setDaemonSetting('share_usage_data', !daemonSettings.share_usage_data)
                  }
                  checked={daemonSettings.share_usage_data}
                  label={__(
                    'Help make LBRY better by contributing analytics and diagnostic data about my usage.'
                  )}
                  helper={__(
                    'You will be ineligible to earn rewards while diagnostics are not being shared.'
                  )}
                />
              </Form>
            </section>

            <section className="card card--section">
              <header className="card__header">
                <h2 className="card__title">{__('Appearance')}</h2>
              </header>

              <Form className="card__content">
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
                    type="setting"
                    name="automatic_dark_mode"
                    onChange={() => this.onAutomaticDarkModeChange(!automaticDarkModeEnabled)}
                    checked={automaticDarkModeEnabled}
                    disabled={isDarkModeEnabled}
                    label={__('Automatic dark mode (9pm to 8am)')}
                  />
                </fieldset-section>
              </Form>
            </section>

            <section className="card card--section">
              <header className="card__header">
                <h2 className="card__title">{__('Wallet Security')}</h2>
              </header>

              <Form className="card__content">
                <FormField
                  type="setting"
                  name="encrypt_wallet"
                  onChange={() => this.onChangeEncryptWallet()}
                  checked={walletEncrypted}
                  label={__('Encrypt my wallet with a custom password.')}
                  helper={
                    <React.Fragment>
                      {__('Secure your local wallet data with a custom password.')}{' '}
                      <strong>{__('Lost passwords cannot be recovered.')} </strong>
                      <Button
                        button="link"
                        label={__('Learn more')}
                        href="https://lbry.io/faq/wallet-encryption"
                      />
                      .
                    </React.Fragment>
                  }
                />
              </Form>
            </section>

            <section className="card card--section">
              <header className="card__header">
                <h2 className="card__title">{__('Experimental Settings')}</h2>
              </header>

              <Form className="card__content">
                <FormField
                  type="setting"
                  name="auto_download"
                  onChange={() => setClientSetting(SETTINGS.AUTO_DOWNLOAD, !autoDownload)}
                  checked={autoDownload}
                  label={__('Automatically download new content from my subscriptions')}
                  helper={__(
                    "The latest file from each of your subscriptions will be downloaded for quick access as soon as it's published."
                  )}
                />

                <FormField
                  type="setting"
                  name="autoplay"
                  onChange={() => setClientSetting(SETTINGS.AUTOPLAY, !autoplay)}
                  checked={autoplay}
                  label={__('Autoplay media files')}
                  helper={__(
                    'Autoplay video and audio files when navigating to a file, as well as the next related item when a file finishes playing.'
                  )}
                />
              </Form>
            </section>

            <section className="card card--section">
              <header className="card__header">
                <h2 className="card__title">{__('Application Cache')}</h2>
                <p className="card__subtitle">
                  {__('This will clear the application cache. Your wallet will not be affected.')}
                </p>
              </header>

              <div className="card__content">
                <Button
                  button="primary"
                  label={this.state.clearingCache ? __('Clearing') : __('Clear Cache')}
                  icon={ICONS.ALERT}
                  onClick={this.clearCache}
                  disabled={this.state.clearingCache}
                />
              </div>
            </section>
          </React.Fragment>
        )}
      </Page>
    );
  }
}

export default SettingsPage;
