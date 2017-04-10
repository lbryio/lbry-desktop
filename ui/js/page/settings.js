import React from 'react';
import {FormField, FormRow} from '../component/form.js';
import lbry from '../lbry.js';

var SettingsPage = React.createClass({
  onRunOnStartChange: function (event) {
    lbry.setDaemonSetting('run_on_startup', event.target.checked);
  },
  onShareDataChange: function (event) {
    lbry.setDaemonSetting('share_debug_info', event.target.checked);
  },
  onDownloadDirChange: function(event) {
    lbry.setDaemonSetting('download_directory', event.target.value);
  },
  onMaxUploadPrefChange: function(isLimited) {
    if (!isLimited) {
      lbry.setDaemonSetting('max_upload', 0.0);
    }
    this.setState({
      isMaxUpload: isLimited
    });
  },
  onMaxUploadFieldChange: function(event) {
    lbry.setDaemonSetting('max_upload', Number(event.target.value));
  },
  onMaxDownloadPrefChange: function(isLimited) {
    if (!isLimited) {
      lbry.setDaemonSetting('max_download', 0.0);
    }
    this.setState({
      isMaxDownload: isLimited
    });
  },
  onMaxDownloadFieldChange: function(event) {
    lbry.setDaemonSetting('max_download', Number(event.target.value));
  },
  getInitialState: function() {
    return {
      settings: null,
      showNsfw: lbry.getClientSetting('showNsfw'),
      showUnavailable: lbry.getClientSetting('showUnavailable'),
    }
  },
  componentDidMount: function() {
    document.title = "Settings";
  },
  componentWillMount: function() {
    lbry.getDaemonSettings(function(settings) {
      this.setState({
        daemonSettings: settings,
        isMaxUpload: settings.max_upload != 0,
        isMaxDownload: settings.max_download != 0
      });
    }.bind(this));
  },
  onShowNsfwChange: function(event) {
    lbry.setClientSetting('showNsfw', event.target.checked);
  },
  onShowUnavailableChange: function(event) {
    lbry.setClientSetting('showUnavailable', event.target.checked);
  },
  render: function() {
    if (!this.state.daemonSettings) {
      return null;
    }

    return (
      <main>
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
            <h4>Max Upload</h4>
            <FormRow type="radio"
                       name="max_upload_pref"
                       onChange={this.onMaxUploadPrefChange.bind(this, false)}
                       defaultChecked={!this.state.isMaxUpload}
                       label="Unlimited" />
            <FormRow type="radio"
                       name="max_upload_pref"
                       onChange={this.onMaxUploadPrefChange.bind(this, true)}
                       defaultChecked={this.state.isMaxUpload}
                       label={ this.state.isMaxUpload ? 'Up to' : 'Choose limit...' } />
            { this.state.isMaxUpload ?
                <FormField type="number"
                           min="0"
                           step=".5"
                           label="MB/s"
                           onChange={this.onMaxUploadFieldChange}
                /> : ''
            }
          </div>
          <div className="card__content">
            <h4>Max Download</h4>
            <FormField label="Unlimited"
                       type="radio"
                       name="max_download_pref"
                       onChange={this.onMaxDownloadPrefChange.bind(this, false)}
                       defaultChecked={!this.state.isMaxDownload} />
            { /*
            <label style={settingsRadioOptionStyles}>
              <input type="radio" name="max_download_pref" onChange={this.onMaxDownloadPrefChange.bind(this, true)} defaultChecked={this.state.isMaxDownload}/> { this.state.isMaxDownload ? 'Up to' : 'Choose limit...' }
              <span className={ this.state.isMaxDownload ? '' : 'hidden'}> <input type="number" min="0" step=".5" defaultValue={this.state.daemonSettings.max_download} style={settingsNumberFieldStyles} onChange={this.onMaxDownloadFieldChange}/> MB/s</span>
            </label> */ }
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
                     defaultChecked={this.state.daemonSettings.share_debug_info}
                     label="Help make LBRY better by contributing diagnostic data about my usage" />
          </div>
        </section>
       </main>
    );
  }
});

/*

 <section className="card">
 <h3>Search</h3>
 <div className="form-row">
 <div className="help">
 Would you like search results to include items that are not currently available for download?
 </div>
 <label style={settingsCheckBoxOptionStyles}>
 <input type="checkbox" onChange={this.onShowUnavailableChange} defaultChecked={this.state.showUnavailable} /> Show unavailable content in search results
 </label>
 </div>
 </section>
 <section className="card">
 <h3>Share Diagnostic Data</h3>
 <label style={settingsCheckBoxOptionStyles}>
 <input type="checkbox" onChange={this.onShareDataChange} defaultChecked={this.state.daemonSettings.upload_log} /> Help make LBRY better by contributing diagnostic data about my usage
 </label>
 </section>
 */

export default SettingsPage;
