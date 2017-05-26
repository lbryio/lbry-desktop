//@TODO: Customize advice based on OS
import React from 'react';
import lbry from 'lbry.js';
import Link from 'component/link';
import SubHeader from 'component/subHeader'
import {version as uiVersion} from 'json!../../../package.json';

class HelpPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      versionInfo: null,
      lbryId: null,
    };
  }

  componentWillMount() {
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
  }

  render() {
    let ver, osName, platform, newVerLink;

    const {
      navigate
    } = this.props

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
      <main className="main--single-column">
        <SubHeader />
        <section className="card">
          <div className="card__title-primary">
            <h3>{__("Read the FAQ")}</h3>
          </div>
          <div className="card__content">
            <p>{__("Our FAQ answers many common questions.")}</p>
            <p><Link href="https://lbry.io/faq" label={__("Read the FAQ")} icon="icon-question" button="alt"/></p>
          </div>
        </section>
        <section className="card">
          <div className="card__title-primary">
            <h3>{__("Get Live Help")}</h3>
          </div>
          <div className="card__content">
            <p>
              {__("Live help is available most hours in the")} <strong>#help</strong> {__("channel of our Slack chat room.")}
            </p>
            <p>
              <Link button="alt" label={__("Join Our Slack")} icon="icon-slack" href="https://slack.lbry.io" />
            </p>
          </div>
        </section>
        <section className="card">
          <div className="card__title-primary"><h3>{__("Report a Bug")}</h3></div>
          <div className="card__content">
            <p>{__("Did you find something wrong?")}</p>
            <p><Link onClick={() => navigate('report')} label={__("Submit a Bug Report")} icon="icon-bug" button="alt" /></p>
            <div className="meta">{__("Thanks! LBRY is made by its users.")}</div>
          </div>
        </section>
        {!ver ? null :
         <section className="card">
           <div className="card__title-primary"><h3>{__("About")}</h3></div>
           <div className="card__content">
             {ver.lbrynet_update_available || ver.lbryum_update_available ?
              <p>{__("A newer version of LBRY is available.")} <Link href={newVerLink} label={__("Download LBRY %s now!"), ver.remote_lbrynet} /></p>
               : <p>{__("Your copy of LBRY is up to date.")}</p>
             }
             <table className="table-standard">
               <tbody>
                 <tr>
                   <th>{__("daemon (lbrynet)")}</th>
                   <td>{ver.lbrynet_version}</td>
                 </tr>
                 <tr>
                   <th>{__("wallet (lbryum)")}</th>
                   <td>{ver.lbryum_version}</td>
                 </tr>
                 <tr>
                   <th>{__("interface")}</th>
                   <td>{uiVersion}</td>
                 </tr>
                 <tr>
                   <th>{__("Platform")}</th>
                   <td>{platform}</td>
                 </tr>
                 <tr>
                   <th>{__("Installation ID")}</th>
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
}

export default HelpPage;
