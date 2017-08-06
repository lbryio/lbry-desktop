import React from "react";
import FormField from "component/formField";
import { FormRow } from "component/form.js";
import SubHeader from "component/subHeader";
import lbry from "lbry.js";
import Link from "component/link";
import FormFieldPrice from "component/formFieldPrice";

const { remote } = require("electron");

class SettingsPage extends React.PureComponent {
  constructor(props) {
    super(props);

    const { daemonSettings } = this.props || {};

    this.state = {
      // isMaxUpload: daemonSettings && daemonSettings.max_upload != 0,
      // isMaxDownload: daemonSettings && daemonSettings.max_download != 0,
      showUnavailable: lbry.getClientSetting("showUnavailable"),
      language: lbry.getClientSetting("language"),
      clearingCache: false,
    };
  }

  clearCache() {
    this.setState({
      clearingCache: true,
    });
    const success = () => {
      this.setState({ clearingCache: false });
      window.location.href = `${remote.app.getAppPath()}/dist/index.html`;
    };
    const clear = () => this.props.clearCache().then(success.bind(this));

    setTimeout(clear, 1000, { once: true });
  }

  setDaemonSetting(name, value) {
    this.props.setDaemonSetting(name, value);
  }

  setClientSetting(name, value) {
    lbry.setClientSetting(name, value);
    this._onSettingSaveSuccess();
  }

  onRunOnStartChange(event) {
    this.setDaemonSetting("run_on_startup", event.target.checked);
  }

  onShareDataChange(event) {
    this.setDaemonSetting("share_usage_data", event.target.checked);
  }

  onDownloadDirChange(event) {
    this.setDaemonSetting("download_directory", event.target.value);
  }

  onKeyFeeChange(newValue) {
    this.setDaemonSetting("max_key_fee", newValue);
  }

  onKeyFeeDisableChange(isDisabled) {
    this.setDaemonSetting("disable_max_key_fee", isDisabled);
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

  onShowNsfwChange(event) {
    this.props.setClientSetting("showNsfw", event.target.checked);
  }

  // onLanguageChange(language) {
  //   lbry.setClientSetting('language', language);
  //   i18n.setLocale(language);
  //   this.setState({language: language})
  // }

  onShowUnavailableChange(event) {}

  render() {
    const { daemonSettings } = this.props;

    if (!daemonSettings || Object.keys(daemonSettings).length === 0) {
      return (
        <main className="main--single-column">
          <span className="empty">{__("Failed to load settings.")}</span>
        </main>
      );
    }
    return (
      <main className="main--single-column">
        <SubHeader />
        <section className="card">
          <div className="card__content">
            <h3>{__("Download Directory")}</h3>
          </div>
          <div className="card__content">
            <FormRow
              type="directory"
              name="download_directory"
              defaultValue={daemonSettings.download_directory}
              helper={__("LBRY downloads will be saved here.")}
              onChange={this.onDownloadDirChange.bind(this)}
            />
          </div>
        </section>
        <section className="card">
          <div className="card__content">
            <h3>{__("Max Purchase Price")}</h3>
          </div>
          <div className="card__content">
            <FormRow
              type="radio"
              name="max_key_fee"
              onClick={() => {
                this.onKeyFeeDisableChange(true);
              }}
              defaultChecked={daemonSettings.disable_max_key_fee}
              label={__("No Limit")}
            />
            <div className="form-row">
              <FormField
                type="radio"
                name="max_key_fee"
                onClick={() => {
                  this.onKeyFeeDisableChange(false);
                }}
                defaultChecked={!daemonSettings.disable_max_key_fee}
                label={
                  daemonSettings.disable_max_key_fee
                    ? __("Choose limit")
                    : __("Limit to")
                }
              />
              {!daemonSettings.disable_max_key_fee &&
                <FormFieldPrice
                  min="0"
                  step="1"
                  onChange={this.onKeyFeeChange.bind(this)}
                  defaultValue={
                    daemonSettings.max_key_fee
                      ? daemonSettings.max_key_fee
                      : { currency: "USD", amount: 50 }
                  }
                />}
            </div>
            <div className="form-field__helper">
              {__(
                "This will prevent you from purchasing any content over this cost, as a safety measure."
              )}
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card__content">
            <h3>{__("Content")}</h3>
          </div>
          <div className="card__content">
            <FormRow
              type="checkbox"
              onChange={this.onShowUnavailableChange.bind(this)}
              defaultChecked={this.state.showUnavailable}
              label={__("Show unavailable content in search results")}
            />
          </div>
          <div className="card__content">
            <FormRow
              label={__("Show NSFW content")}
              type="checkbox"
              onChange={this.onShowNsfwChange.bind(this)}
              defaultChecked={this.props.showNsfw}
              helper={__(
                "NSFW content may include nudity, intense sexuality, profanity, or other adult content. By displaying NSFW content, you are affirming you are of legal age to view mature content in your country or jurisdiction.  "
              )}
            />
          </div>
        </section>

        <section className="card">
          <div className="card__content">
            <h3>{__("Share Diagnostic Data")}</h3>
          </div>
          <div className="card__content">
            <FormRow
              type="checkbox"
              onChange={this.onShareDataChange.bind(this)}
              defaultChecked={daemonSettings.share_usage_data}
              label={__(
                "Help make LBRY better by contributing diagnostic data about my usage"
              )}
            />
          </div>
        </section>

        <section className="card">
          <div className="card__content">
            <h3>{__("Application Cache")}</h3>
          </div>
          <div className="card__content">
            <p>
              <Link
                label={
                  this.state.clearingCache
                    ? __("Clearing")
                    : __("Clear the cache")
                }
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
  }
}

export default SettingsPage;
