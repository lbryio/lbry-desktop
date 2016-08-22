var settingsRadioOptionStyles = {
  display: 'block',
  marginLeft: '13px'
}, settingsCheckBoxOptionStyles = {
  display: 'block',
  marginLeft: '13px'
}, settingsNumberFieldStyles = {
  width: '40px'
}, downloadDirectoryLabelStyles = {
  fontSize: '.9em',
  marginLeft: '13px'
}, downloadDirectoryFieldStyles= {
  width: '300px'
};

var SettingsPage = React.createClass({
  onRunOnStartChange: function (event) {
    lbry.setDaemonSetting('run_on_startup', event.target.checked);
  },
  onShareDataChange: function (event) {
    lbry.setDaemonSetting('upload_log', event.target.checked);
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
      settings: null
    }
  },
  componentDidMount: function() {
    document.title = "Settings";
  },
  componentWillMount: function() {
    lbry.getDaemonSettings(function(settings) {
      this.setState({
        initDaemonSettings: settings,
        isMaxUpload: settings.max_upload != 0,
        isMaxDownload: settings.max_download != 0
      });
    }.bind(this));
  },
  render: function() {
    if (!this.state.initDaemonSettings) {
      return null;
    }

    return (
      <main>
        <section className="card">
          <h3>Run on Startup</h3>
          <label style={settingsCheckBoxOptionStyles}>
            <input type="checkbox" onChange={this.onRunOnStartChange} defaultChecked={this.state.initDaemonSettings.run_on_startup} /> Run LBRY automatically when I start my computer
          </label>
        </section>
        <section className="card">
          <h3>Download Directory</h3>
          <div className="help">Where would you like the files you download from LBRY to be saved?</div>
          <input style={downloadDirectoryFieldStyles} type="text" name="download_directory" defaultValue={this.state.initDaemonSettings.download_directory} onChange={this.onDownloadDirChange}/>
        </section>
        <section className="card">
          <h3>Bandwidth Limits</h3>
          <div className="form-row">
            <h4>Max Upload</h4>
            <label style={settingsRadioOptionStyles}>
              <input type="radio" name="max_upload_pref" onChange={this.onMaxUploadPrefChange.bind(this, false)} defaultChecked={!this.state.isMaxUpload}/> Unlimited
            </label>
            <label style={settingsRadioOptionStyles}>
              <input type="radio" name="max_upload_pref" onChange={this.onMaxUploadPrefChange.bind(this, true)} defaultChecked={this.state.isMaxUpload}/> { this.state.isMaxUpload ? 'Up to' : 'Choose limit...' }
              <span className={ this.state.isMaxUpload ? '' : 'hidden'}> <input type="number" min="0" step=".5" defaultValue={this.state.initDaemonSettings.max_upload} style={settingsNumberFieldStyles} onChange={this.onMaxUploadFieldChange}/> MB/s</span>
            </label>
          </div>
          <div className="form-row">
            <h4>Max Download</h4>
            <label style={settingsRadioOptionStyles}>
              <input type="radio" name="max_download_pref" onChange={this.onMaxDownloadPrefChange.bind(this, false)} defaultChecked={!this.state.isMaxDownload}/> Unlimited
            </label>
            <label style={settingsRadioOptionStyles}>
              <input type="radio" name="max_download_pref" onChange={this.onMaxDownloadPrefChange.bind(this, true)} defaultChecked={this.state.isMaxDownload}/> { this.state.isMaxDownload ? 'Up to' : 'Choose limit...' }
              <span className={ this.state.isMaxDownload ? '' : 'hidden'}> <input type="number" min="0" step=".5" defaultValue={this.state.initDaemonSettings.max_download} style={settingsNumberFieldStyles} onChange={this.onMaxDownloadFieldChange}/> MB/s</span>
            </label>
          </div>
        </section>
        <section className="card">
          <h3>Share Diagnostic Data</h3>
          <label style={settingsCheckBoxOptionStyles}>
            <input type="checkbox" onChange={this.onShareDataChange} defaultChecked={this.state.initDaemonSettings.upload_log} /> Help make LBRY better by contributing diagnostic data about my usage
          </label>
        </section>
       </main>
    );
  }
});