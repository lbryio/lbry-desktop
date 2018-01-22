import React from 'react';
import FormField from 'component/formField';
import { FormRow } from 'component/form';
import SubHeader from 'component/subHeader';
import * as settings from 'constants/settings';
import Link from 'component/link';
import FormFieldPrice from 'component/formFieldPrice';

class SettingsPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      clearingCache: false,
    };
  }

  componentWillMount() {
    // eslint-disable-next-line react/prop-types
    this.props.getThemes();
  }

  componentDidMount() {}

  onRunOnStartChange(event) {
    this.setDaemonSetting('run_on_startup', event.target.checked);
  }

  onShareDataChange(event) {
    this.setDaemonSetting('share_usage_data', event.target.checked);
  }

  onDownloadDirChange(event) {
    this.setDaemonSetting('download_directory', event.target.value);
  }

  onKeyFeeChange(newValue) {
    const setting = newValue;

    // this is stupid and should be fixed... somewhere
    if (setting && (setting.amount === undefined || setting.amount === null)) {
      setting.amount = 0;
    }

    this.setDaemonSetting('max_key_fee', setting);
  }

  onKeyFeeDisableChange(isDisabled) {
    this.setDaemonSetting('disable_max_key_fee', isDisabled);
  }

  onThemeChange(event) {
    const { value } = event.target;
    // eslint-disable-next-line react/prop-types
    this.props.setClientSetting(settings.THEME, value);
  }

  onInstantPurchaseEnabledChange(enabled) {
    this.props.setClientSetting(settings.INSTANT_PURCHASE_ENABLED, enabled);
  }

  onInstantPurchaseMaxChange(newValue) {
    this.props.setClientSetting(settings.INSTANT_PURCHASE_MAX, newValue);
  }

  onShowNsfwChange(event) {
    this.props.setClientSetting(settings.SHOW_NSFW, event.target.checked);
  }

  onLanguageChange(e) {
    // eslint-disable-next-line react/prop-types
    this.props.changeLanguage(e.target.value);
    this.forceUpdate();
  }

  onShowUnavailableChange(event) {
    this.props.setClientSetting(settings.SHOW_UNAVAILABLE, event.target.checked);
  }

  setDaemonSetting(name, value) {
    // eslint-disable-next-line react/prop-types
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
    // eslint-disable-next-line react/prop-types
    const clear = () => this.props.clearCache().then(success.bind(this));

    setTimeout(clear, 1000, { once: true });
  }

  // onMaxUploadPrefChange(isLimited) {
  //   if (!isLimited) {
  //     this.setDaemonSetting("max_upload", 0.0);
  //   }
  //   this.setState({
  //     isMaxUpload: isLimited,
  //   });
  // }
  //
  // onMaxUploadFieldChange(event) {
  //   this.setDaemonSetting("max_upload", Number(event.target.value));
  // }
  //
  // onMaxDownloadPrefChange(isLimited) {
  //   if (!isLimited) {
  //     this.setDaemonSetting("max_download", 0.0);
  //   }
  //   this.setState({
  //     isMaxDownload: isLimited,
  //   });
  // }
  //
  // onMaxDownloadFieldChange(event) {
  //   this.setDaemonSetting("max_download", Number(event.target.value));
  // }

  render() {
    /* eslint-disable react/prop-types */
    const {
      daemonSettings,
      showNsfw,
      instantPurchaseEnabled,
      instantPurchaseMax,
      showUnavailable,
      theme,
      themes,
    } = this.props;
    /* eslint-enable react/prop-types */

    if (!daemonSettings || Object.keys(daemonSettings).length === 0) {
      return (
        <main className="main--single-column">
          <span className="empty">{__('Failed to load settings.')}</span>
        </main>
      );
    }

    /* eslint-disable react/jsx-no-bind, no-shadow, no-unused-vars, jsx-a11y/anchor-is-valid */
    return (
      <main className="main--single-column">
        <SubHeader />
        {/*
        <section className="card">
          <div className="card__content">
            <h4>{__("Language")}</h4>
          </div>
          <div className="card__content">
            <div className="form-row">
              <FormField
                type="select"
                name="language"
                defaultValue={language}
                onChange={this.onLanguageChange.bind(this)}
              >
                <option value="en">{__("English")}</option>
                {Object.keys(languages).map(dLang =>
                  <option key={dLang} value={dLang}>
                    {languages[dLang]}
                  </option>
                )}
              </FormField>
            </div>
          </div>
        </section> */}
        <section className="card">
          <div className="card__content">
            <h4>{__('Download Directory')}</h4>
          </div>
          <div className="card__content">
            <FormRow
              type="directory"
              name="download_directory"
              defaultValue={daemonSettings.download_directory}
              helper={__('LBRY downloads will be saved here.')}
              onChange={this.onDownloadDirChange.bind(this)}
            />
          </div>
        </section>
        <section className="card">
          <div className="card__content">
            <h4>{__('Max Purchase Price')}</h4>
          </div>
          <div className="card__content">
            <FormRow
              type="radio"
              name="max_key_fee"
              onClick={() => {
                this.onKeyFeeDisableChange(true);
              }}
              defaultChecked={daemonSettings.disable_max_key_fee}
              label={__('No Limit')}
            />
            <div className="form-row">
              <FormField
                type="radio"
                name="max_key_fee"
                onClick={() => {
                  this.onKeyFeeDisableChange(false);
                }}
                defaultChecked={!daemonSettings.disable_max_key_fee}
                label={daemonSettings.disable_max_key_fee ? __('Choose limit') : __('Limit to')}
              />
              {!daemonSettings.disable_max_key_fee && (
                <FormFieldPrice
                  min="0"
                  onChange={this.onKeyFeeChange.bind(this)}
                  defaultValue={
                    daemonSettings.max_key_fee
                      ? daemonSettings.max_key_fee
                      : { currency: 'USD', amount: 50 }
                  }
                />
              )}
            </div>
            <div className="form-field__helper">
              {__(
                'This will prevent you from purchasing any content over this cost, as a safety measure.'
              )}
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card__content">
            <h4>{__('Purchase Confirmations')}</h4>
          </div>
          <div className="card__content">
            <FormRow
              type="radio"
              name="instant_purchase_max"
              defaultChecked={!instantPurchaseEnabled}
              label={__('Ask for confirmation of all purchases')}
              onClick={e => {
                this.onInstantPurchaseEnabledChange(false);
              }}
            />
            <div className="form-row">
              <FormField
                type="radio"
                name="instant_purchase_max"
                defaultChecked={instantPurchaseEnabled}
                label={`Single-click purchasing of content less than${
                  instantPurchaseEnabled ? '' : '...'
                }`}
                onClick={e => {
                  this.onInstantPurchaseEnabledChange(true);
                }}
              />
              {instantPurchaseEnabled && (
                <FormFieldPrice
                  min="0.1"
                  onChange={val => this.onInstantPurchaseMaxChange(val)}
                  defaultValue={instantPurchaseMax}
                />
              )}
            </div>
            <div className="form-field__helper">
              When this option is chosen, LBRY won&apos;t ask you to confirm downloads below the
              given price.
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card__content">
            <h4>{__('Content')}</h4>
          </div>
          <div className="card__content">
            <FormRow
              type="checkbox"
              onChange={this.onShowUnavailableChange.bind(this)}
              defaultChecked={showUnavailable}
              label={__('Show unavailable content in search results')}
            />
            <FormRow
              label={__('Show NSFW content')}
              type="checkbox"
              onChange={this.onShowNsfwChange.bind(this)}
              defaultChecked={showNsfw}
              helper={__(
                'NSFW content may include nudity, intense sexuality, profanity, or other adult content. By displaying NSFW content, you are affirming you are of legal age to view mature content in your country or jurisdiction.  '
              )}
            />
          </div>
        </section>

        <section className="card">
          <div className="card__content">
            <h4>{__('Share Diagnostic Data')}</h4>
          </div>
          <div className="card__content">
            <FormRow
              type="checkbox"
              onChange={this.onShareDataChange.bind(this)}
              defaultChecked={daemonSettings.share_usage_data}
              label={__('Help make LBRY better by contributing diagnostic data about my usage')}
            />
          </div>
        </section>

        <section className="card">
          <div className="card__content">
            <h4>{__('Theme')}</h4>
          </div>
          <div className="card__content">
            <FormField
              type="select"
              onChange={this.onThemeChange.bind(this)}
              defaultValue={theme}
              className="form-field__input--inline"
            >
              {themes.map((theme, index) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </FormField>
          </div>
        </section>

        <section className="card">
          <div className="card__content">
            <h4>{__('Application Cache')}</h4>
          </div>
          <div className="card__content">
            <p>
              <Link
                label={this.state.clearingCache ? __('Clearing') : __('Clear the cache')}
                icon="icon-trash"
                button="alt"
                onClick={this.clearCache.bind(this)}
                disabled={this.state.clearingCache}
              />
            </p>
          </div>
        </section>
      </main>
    );
    /* eslint-enable react/jsx-no-bind, no-shadow, no-unused-vars, jsx-a11y/anchor-is-valid */
  }
}

export default SettingsPage;
