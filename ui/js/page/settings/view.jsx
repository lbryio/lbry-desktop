import React from "react";
import { FormField, FormRow } from "component/form.js";
import SubHeader from "component/subHeader";
import lbry from "lbry.js";
import Link from "component/link";

const { remote } = require("electron");

class SettingsPage extends React.PureComponent {
  constructor(props) {
    super(props);

    const { daemonSettings } = this.props;

    this.state = {
      isMaxUpload: daemonSettings && daemonSettings.max_upload != 0,
      isMaxDownload: daemonSettings && daemonSettings.max_download != 0,
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

  onMaxUploadPrefChange(isLimited) {
    if (!isLimited) {
      this.setDaemonSetting("max_upload", 0.0);
    }
    this.setState({
      isMaxUpload: isLimited,
    });
  }

  onMaxUploadFieldChange(event) {
    this.setDaemonSetting("max_upload", Number(event.target.value));
  }

  onMaxDownloadPrefChange(isLimited) {
    if (!isLimited) {
      this.setDaemonSetting("max_download", 0.0);
    }
    this.setState({
      isMaxDownload: isLimited,
    });
  }

  onMaxDownloadFieldChange(event) {
    this.setDaemonSetting("max_download", Number(event.target.value));
  }

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

    if (!daemonSettings) {
      return (
        <main className="main--single-column">
          <span className="empty">{__("Failed to load settings.")}</span>
        </main>
      );
    }
    /*
 <section className="card">
 <div className="card__content">
 <h3>Run on Startup</h3>
 </div>
 <div className="card__content">
 <FormRow type="checkbox"
 onChange={this.onRunOnStartChange}
 defaultChecked={daemonSettings.run_on_startup}
 label="Run LBRY automatically when I start my computer" />
 </div>
 </section>
 */
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
            <h3>{__("Bandwidth Limits")}</h3>
          </div>
          <div className="card__content">
            <div className="form-row__label-row">
              <div className="form-field__label">{__("Max Upload")}</div>
            </div>
            <FormRow
              type="radio"
              name="max_upload_pref"
              onChange={() => {
                this.onMaxUploadPrefChange(false);
              }}
              defaultChecked={!this.state.isMaxUpload}
              label={__("Unlimited")}
            />
            <div className="form-row">
              <FormField
                type="radio"
                name="max_upload_pref"
                onChange={() => {
                  this.onMaxUploadPrefChange(true);
                }}
                defaultChecked={this.state.isMaxUpload}
                label={
                  this.state.isMaxUpload ? __("Up to") : __("Choose limit...")
                }
              />
              {this.state.isMaxUpload
                ? <FormField
                    type="number"
                    min="0"
                    step=".5"
                    defaultValue={daemonSettings.max_upload}
                    placeholder="10"
                    className="form-field__input--inline"
                    onChange={this.onMaxUploadFieldChange.bind(this)}
                  />
                : ""}
              {this.state.isMaxUpload
                ? <span className="form-field__label">MB/s</span>
                : ""}
            </div>
          </div>
          <div className="card__content">
            <div className="form-row__label-row">
              <div className="form-field__label">{__("Max Download")}</div>
            </div>
            <FormRow
              label={__("Unlimited")}
              type="radio"
              name="max_download_pref"
              onChange={() => {
                this.onMaxDownloadPrefChange(false);
              }}
              defaultChecked={!this.state.isMaxDownload}
            />
            <div className="form-row">
              <FormField
                type="radio"
                name="max_download_pref"
                onChange={() => {
                  this.onMaxDownloadPrefChange(true);
                }}
                defaultChecked={this.state.isMaxDownload}
                label={
                  this.state.isMaxDownload ? __("Up to") : __("Choose limit...")
                }
              />
              {this.state.isMaxDownload
                ? <FormField
                    type="number"
                    min="0"
                    step=".5"
                    defaultValue={daemonSettings.max_download}
                    placeholder="10"
                    className="form-field__input--inline"
                    onChange={this.onMaxDownloadFieldChange.bind(this)}
                  />
                : ""}
              {this.state.isMaxDownload
                ? <span className="form-field__label">MB/s</span>
                : ""}
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
            <h3>{__("Language")}</h3>
          </div>
          <div className="card__content">
            <div className="form-row">
              <FormField
                type="radio"
                name="language"
                label={__("English")}
                onChange={() => {
                  this.onLanguageChange("en");
                }}
                defaultChecked={this.state.language == "en"}
              />
            </div>
            <div className="form-row">
              <FormField
                type="radio"
                name="language"
                label="Serbian"
                onChange={() => {
                  this.onLanguageChange("rs");
                }}
                defaultChecked={this.state.language == "rs"}
              />
            </div>
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
