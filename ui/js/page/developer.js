import lbry from '../lbry.js';
import React from 'react';
import FormField from '../component/form.js';
import {Link} from '../component/link.js';

const fs = require('fs');
const {ipcRenderer} = require('electron');

const DeveloperPage = React.createClass({
  getInitialState: function() {
    return {
      showDeveloperMenu: lbry.getClientSetting('showDeveloperMenu'),
      useCustomLighthouseServers: lbry.getClientSetting('useCustomLighthouseServers'),
      customLighthouseServers: lbry.getClientSetting('customLighthouseServers').join('\n'),
      upgradePath: '',
    };
  },
  handleShowDeveloperMenuChange: function(event) {
    lbry.setClientSetting('showDeveloperMenu', event.target.checked);
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
  handleUpgradeFileChange: function(event) {
    this.setState({
      upgradePath: event.target.files[0].path,
    });
  },
  handleForceUpgradeClick: function() {
    let upgradeSent = false;
    if (!this.state.upgradePath) {
      alert('Please select a file to upgrade from');
    } else {
      try {
        const stats = fs.lstatSync(this.state.upgradePath);
        if (stats.isFile()) {
          console.log('Starting upgrade using ' + this.state.upgradePath);
          ipcRenderer.send('upgrade', this.state.upgradePath);
          upgradeSent = true;
        }
      }
      catch (e) {}
      if (!upgradeSent) {
        alert('Failed to start upgrade. Is "' + this.state.upgradePath + '" a valid path to the upgrade?');
      }
    }
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
        <section className="card">
          <div className="form-row">
            <FormField name="file" ref="file" type="file" onChange={this.handleUpgradeFileChange}/>
            &nbsp;
            <Link label="Force Upgrade" button="alt" onClick={this.handleForceUpgradeClick} />
          </div>
        </section>
      </main>
    );
  }
});

export default DeveloperPage;
