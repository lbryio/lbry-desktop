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
  storeSetting: function(setting, val) {
    var settings = Object.assign({}, this.state.settings);
    settings[setting] = val;
    this.setState({
      'settings': settings
    });
    lbry.setSettings(settings);
  },
  onRunOnNsfwChange: function (event) {
    this.storeSetting('show_nsfw', event.target.checked);
  },
  onRunOnStartChange: function (event) {
    this.storeSetting('run_on_startup', event.target.checked);
  },
  onShareDataChange: function (event) {
    this.storeSetting('upload_log', event.target.checked);
  },
  onDownloadDirChange: function(event) {
    this.storeSetting('download_directory', event.target.value);
  },
  onMaxUploadPrefChange: function(isLimited) {
    if (!isLimited) {
      this.storeSetting('max_upload', 0.0);
    }
    this.setState({
      isMaxUpload: isLimited
    });
  },
  onMaxUploadFieldChange: function(event) {
    this.storeSetting('max_upload', Number(event.target.value));
  },
  onMaxDownloadPrefChange: function(isLimited) {
    if (!isLimited) {
      this.storeSetting('max_download', 0.0);
    }
    this.setState({
      isMaxDownload: isLimited
    });
  },
  onMaxDownloadFieldChange: function(event) {
    this.storeSetting('max_download', Number(event.target.value));
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
    lbry.getSettings(function(settings) {
      this.setState({
        settings: settings,
        isMaxUpload: settings.max_upload != 0,
        isMaxDownload: settings.max_download != 0
      });
    }.bind(this));
  },
  render: function() {
    if (!this.state.settings) { // If the settings aren't loaded yet, don't render anything.
      return null;
    }

    return (
      <main>
        <section className="card">
          <h3>Content Filtering</h3>
          <label style={settingsCheckBoxOptionStyles}>
            <input type="checkbox" onChange={this.onRunOnNsfwChange} defaultChecked={this.state.settings.show_nsfw} /> Show NSFW content
          </label>
        </section>
        <section className="card">
          <h3>Run on Startup</h3>
          <label style={settingsCheckBoxOptionStyles}>
            <input type="checkbox" onChange={this.onRunOnStartChange} defaultChecked={this.state.settings.run_on_startup} /> Run LBRY automatically when I start my computer
          </label>
        </section>
        <section className="card">
          <h3>Download Directory</h3>
          <div className="help">Where would you like the files you download from LBRY to be saved?</div>
          <input style={downloadDirectoryFieldStyles} type="text" name="download_directory" defaultValue={this.state.settings.download_directory} onChange={this.onDownloadDirChange}/>
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
              <span className={ this.state.isMaxUpload ? '' : 'hidden'}> <input type="number" min="0" step=".5" defaultValue={this.state.settings.max_upload} style={settingsNumberFieldStyles} onChange={this.onMaxUploadFieldChange}/> MB/s</span>
            </label>
          </div>
          <div className="form-row">
            <h4>Max Download</h4>
            <label style={settingsRadioOptionStyles}>
              <input type="radio" name="max_download_pref" onChange={this.onMaxDownloadPrefChange.bind(this, false)} defaultChecked={!this.state.isMaxDownload}/> Unlimited
            </label>
            <label style={settingsRadioOptionStyles}>
              <input type="radio" name="max_download_pref" onChange={this.onMaxDownloadPrefChange.bind(this, true)} defaultChecked={this.state.isMaxDownload}/> { this.state.isMaxDownload ? 'Up to' : 'Choose limit...' }
              <span className={ this.state.isMaxDownload ? '' : 'hidden'}> <input type="number" min="0" step=".5" defaultValue={this.state.settings.max_download} style={settingsNumberFieldStyles} onChange={this.onMaxDownloadFieldChange}/> MB/s</span>
            </label>
          </div>
        </section>
        <section className="card">
          <h3>Share Diagnostic Data</h3>
          <label style={settingsCheckBoxOptionStyles}>
            <input type="checkbox" onChange={this.onShareDataChange} defaultChecked={this.state.settings.upload_log} /> Help make LBRY better by contributing diagnostic data about my usage
          </label>
        </section>
       </main>
    );
  }
});
