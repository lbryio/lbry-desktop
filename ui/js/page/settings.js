import React from 'react';
import {FormField, FormRow} from '../component/form.js';
import SubHeader from 'component/subHeader'
import lbry from '../lbry.js';

var SettingsPage = React.createClass({
  _onSettingSaveSuccess: function() {
    // This is bad.
    // document.dispatchEvent(new CustomEvent('globalNotice', {
    //   detail: {
    //     message: "Settings saved",
    //   },
    // }))
  },
  setDaemonSetting: function(name, value) {
    lbry.setDaemonSetting(name, value, this._onSettingSaveSuccess)
  },
  setClientSetting: function(name, value) {
    lbry.setClientSetting(name, value)
    this._onSettingSaveSuccess()
    },
  onRunOnStartChange: function (event) {
    this.setDaemonSetting('run_on_startup', event.target.checked);
  },
  onShareDataChange: function (event) {
    this.setDaemonSetting('share_usage_data', event.target.checked);
  },
  onDownloadDirChange: function(event) {
    this.setDaemonSetting('download_directory', event.target.value);
  },
  onMaxUploadPrefChange: function(isLimited) {
    if (!isLimited) {
      this.setDaemonSetting('max_upload', 0.0);
    }
    this.setState({
      isMaxUpload: isLimited
    });
  },
  onMaxUploadFieldChange: function(event) {
    this.setDaemonSetting('max_upload', Number(event.target.value));
  },
  onMaxDownloadPrefChange: function(isLimited) {
    if (!isLimited) {
      this.setDaemonSetting('max_download', 0.0);
    }
    this.setState({
      isMaxDownload: isLimited
    });
  },
  onMaxDownloadFieldChange: function(event) {
    this.setDaemonSetting('max_download', Number(event.target.value));
  },
  getInitialState: function() {
    return {
      settings: null,
      showNsfw: lbry.getClientSetting('showNsfw'),
      showUnavailable: lbry.getClientSetting('showUnavailable'),
    }
  },
  componentWillMount: function() {
    lbry.getDaemonSettings((settings) => {
      this.setState({
        daemonSettings: settings,
        isMaxUpload: settings.max_upload != 0,
        isMaxDownload: settings.max_download != 0
      });
    });
  },
  onShowNsfwChange: function(event) {
    lbry.setClientSetting('showNsfw', event.target.checked);
  },
  onShowUnavailableChange: function(event) {

  },
  render: function() {
    if (!this.state.daemonSettings) {
      return null;
    }
/*
 <section className="card">
 <div className="card__content">
 <h3>Run on Startup</h3>
 </div>
 <div className="card__content">
 <FormRow type="checkbox"
 onChange={this.onRunOnStartChange}
 defaultChecked={this.state.daemonSettings.run_on_startup}
 label="Run LBRY automatically when I start my computer" />
 </div>
 </section>
 */
    return (
      <main className="main--single-column">
        <SubHeader />
        <section className="card">
          <div className="card__content">
            <h3>Download Directory</h3>
          </div>
          <div className="card__content">
            <FormRow type="text"
                   name="download_directory"
                   defaultValue={this.state.daemonSettings.download_directory}
                   helper="LBRY downloads will be saved here."
                   onChange={this.onDownloadDirChange} />
          </div>
        </section>
        <section className="card">
          <div className="card__content">
           <h3>Bandwidth Limits</h3>
          </div>
          <div className="card__content">
            <div className="form-row__label-row"><div className="form-field__label">Max Upload</div></div>
            <FormRow type="radio"
                       name="max_upload_pref"
                       onChange={() => { this.onMaxUploadPrefChange(false) }}
                       defaultChecked={!this.state.isMaxUpload}
                       label="Unlimited" />
            <div className="form-row">
              <FormField type="radio"
                         name="max_upload_pref"
                         onChange={() => { this.onMaxUploadPrefChange(true) }}
                         defaultChecked={this.state.isMaxUpload}
                         label={ this.state.isMaxUpload ? 'Up to' : 'Choose limit...' } />
              { this.state.isMaxUpload ?
                  <FormField type="number"
                             min="0"
                             step=".5"
                             defaultValue={this.state.daemonSettings.max_upload}
                             placeholder="10"
                             className="form-field__input--inline"
                             onChange={this.onMaxUploadFieldChange}
                  />
                  : ''

              }
              { this.state.isMaxUpload ?  <span className="form-field__label">MB/s</span> : '' }
            </div>
          </div>
          <div className="card__content">
            <div className="form-row__label-row"><div className="form-field__label">Max Download</div></div>
            <FormRow label="Unlimited"
                       type="radio"
                       name="max_download_pref"
                       onChange={() => { this.onMaxDownloadPrefChange(false) }}
                       defaultChecked={!this.state.isMaxDownload} />
            <div className="form-row">
              <FormField type="radio"
                         name="max_download_pref"
                         onChange={() => { this.onMaxDownloadPrefChange(true) }}
                         defaultChecked={this.state.isMaxDownload}
                         label={ this.state.isMaxDownload ? 'Up to' : 'Choose limit...' } />
              { this.state.isMaxDownload ?
                <FormField type="number"
                           min="0"
                           step=".5"
                           defaultValue={this.state.daemonSettings.max_download}
                           placeholder="10"
                           className="form-field__input--inline"
                           onChange={this.onMaxDownloadFieldChange}
                />
                : ''

              }
              { this.state.isMaxDownload ?  <span className="form-field__label">MB/s</span> : '' }
            </div>
          </div>
        </section>
        <section className="card">
          <div className="card__content">
            <h3>Content</h3>
          </div>
          <div className="card__content">
            <FormRow type="checkbox"
                     onChange={this.onShowUnavailableChange}
                     defaultChecked={this.state.showUnavailable}
                     label="Show unavailable content in search results"  />
          </div>
          <div className="card__content">
            <FormRow label="Show NSFW content" type="checkbox"
                     onChange={this.onShowNsfwChange}  defaultChecked={this.state.showNsfw}
                     helper="NSFW content may include nudity, intense sexuality, profanity, or other adult content. By displaying NSFW content, you are affirming you are of legal age to view mature content in your country or jurisdiction.  " />
          </div>
        </section>
        <section className="card">
          <div className="card__content">
            <h3>Share Diagnostic Data</h3>
          </div>
          <div className="card__content">
            <FormRow type="checkbox"
                     onChange={this.onShareDataChange}
                     defaultChecked={this.state.daemonSettings.share_usage_data}
                     label="Help make LBRY better by contributing diagnostic data about my usage" />
          </div>
        </section>
       </main>
    );
  }
});

export default SettingsPage;
