import lbry from '../lbry.js';
import React from 'react';
import FormField from '../component/form.js';

const DeveloperPage = React.createClass({
  getInitialState: function() {
    return {
      showDeveloperMenu: lbry.getClientSetting('menu') == 'developer',
      useCustomLighthouseServers: lbry.getClientSetting('useCustomLighthouseServers'),
      customLighthouseServers: lbry.getClientSetting('customLighthouseServers').join('\n'),
    };
  },
  handleShowDeveloperMenuChange: function(event) {
    lbry.setClientSetting('menu', event.target.checked ? 'developer' : 'normal');
    lbry.showMenuIfNeeded();
    this.setState({
      showDeveloperMenu: event.target.checked,
    });
  },
  handleUseCustomLighthouseServersChange: function(event) {
    lbry.setClientSetting('useCustomLighthouseServers', event.target.checked);
    this.setState({
      useCustomLighthouseServers: event.target.checked,
    });
  },
  render: function() {
    return (
      <main>
        <section className="card">
          <h3>Developer Settings</h3>
          <div className="form-row">
            <label><FormField type="checkbox" onChange={this.handleShowDeveloperMenuChange} checked={this.state.showDeveloperMenu} /> Show developer menu</label>
          </div>
          <div className="form-row">
            <label><FormField type="checkbox" onChange={this.handleUseCustomLighthouseServersChange} checked={this.state.useCustomLighthouseServers} /> Use custom search servers</label>
          </div>
          {this.state.useCustomLighthouseServers
            ? <div className="form-row">
                <label>
                  Custom search servers (one per line)
                  <div><FormField type="textarea" className="developer-page__custom-lighthouse-servers" value={this.state.customLighthouseServers} onChange={this.handleCustomLighthouseServersChange} checked={this.state.debugMode} /></div>
                </label>
              </div>
            : null}
        </section>
      </main>
    );
  }
});

export default DeveloperPage;
