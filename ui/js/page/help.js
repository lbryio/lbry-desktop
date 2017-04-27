//@TODO: Customize advice based on OS
//@TODO: Customize advice based on OS
import React from 'react';
import lbry from '../lbry.js';
import {Link} from '../component/link.js';
import {SettingsNav} from './settings.js';
import {version as uiVersion} from 'json!../../package.json';

var HelpPage = React.createClass({
  getInitialState: function() {
    return {
      versionInfo: null,
      lbryId: null,
    };
  },
  componentWillMount: function() {
    lbry.getVersionInfo((info) => {
      this.setState({
        versionInfo: info,
      });
    });
    lbry.getSessionInfo((info) => {
      this.setState({
        lbryId: info.lbry_id,
      });
    });
  },
  componentDidMount: function() {
    document.title = "Help";
  },
  render: function() {
    let ver, osName, platform, newVerLink;
    if (this.state.versionInfo) {
      ver = this.state.versionInfo;

      if (ver.os_system == 'Darwin') {
        osName = (parseInt(ver.os_release.match(/^\d+/)) < 16 ? 'Mac OS X' : 'Mac OS');

        platform = `${osName} ${ver.os_release}`
        newVerLink = 'https://lbry.io/get/lbry.dmg';
      } else if (ver.os_system == 'Linux') {
        platform = `Linux (${ver.platform})`;
        newVerLink = 'https://lbry.io/get/lbry.deb';
      } else {
        platform = `Windows (${ver.platform})`;
        newVerLink = 'https://lbry.io/get/lbry.msi';
      }
    } else {
      ver = null;
    }

    return (
      <main className="constrained-page">
        <SettingsNav viewingPage="help" />
        <section className="card">
          <div className="card__title-primary">
            <h3>Read the FAQ</h3>
          </div>
          <div className="card__content">
            <p>Our FAQ answers many common questions.</p>
            <p><Link href="https://lbry.io/faq" label="Read the FAQ" icon="icon-question" button="alt"/></p>
          </div>
        </section>
        <section className="card">
          <div className="card__title-primary">
            <h3>Get Live Help</h3>
          </div>
          <div className="card__content">
            <p>
              Live help is available most hours in the <strong>#help</strong> channel of our Slack chat room.
            </p>
            <p>
              <Link button="alt" label="Join Our Slack" icon="icon-slack" href="https://slack.lbry.io" />
            </p>
          </div>
        </section>
        <section className="card">
          <div className="card__title-primary"><h3>Report a Bug</h3></div>
          <div className="card__content">
            <p>Did you find something wrong?</p>
            <p><Link href="?report" label="Submit a Bug Report" icon="icon-bug" button="alt" /></p>
            <div className="meta">Thanks! LBRY is made by its users.</div>
          </div>
        </section>
        {!ver ? null :
          <section className="card">
            <div className="card__title-primary"><h3>About</h3></div>
            <div className="card__content">
              {ver.lbrynet_update_available || ver.lbryum_update_available ?
                <p>A newer version of LBRY is available. <Link href={newVerLink} label={`Download LBRY ${ver.remote_lbrynet} now!`} /></p>
                : <p>Your copy of LBRY is up to date.</p>
              }
              <table className="table-standard">
                <tbody>
                  <tr>
                    <th>daemon (lbrynet)</th>
                    <td>{ver.lbrynet_version}</td>
                  </tr>
                  <tr>
                    <th>wallet (lbryum)</th>
                    <td>{ver.lbryum_version}</td>
                  </tr>
                  <tr>
                    <th>interface</th>
                    <td>{uiVersion}</td>
                  </tr>
                  <tr>
                    <th>Platform</th>
                    <td>{platform}</td>
                  </tr>
                  <tr>
                    <th>Installation ID</th>
                    <td>{this.state.lbryId}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        }
      </main>
    );
  }
});

export default HelpPage;