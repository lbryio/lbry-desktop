//@TODO: Customize advice based on OS
import React from "react";
import lbry from "lbry.js";
import Link from "component/link";
import SubHeader from "component/subHeader";
import { BusyMessage } from "component/common";

class HelpPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      versionInfo: null,
      lbryId: null,
      uiVersion: null,
      upgradeAvailable: null,
      accessTokenHidden: true,
    };
  }

  componentWillMount() {
    lbry
      .getAppVersionInfo()
      .then(({ remoteVersion, localVersion, upgradeAvailable }) => {
        this.setState({
          uiVersion: localVersion,
          upgradeAvailable: upgradeAvailable,
        });
      });
    lbry.version().then(info => {
      this.setState({
        versionInfo: info,
      });
    });
    lbry.status({ session_status: true }).then(info => {
      this.setState({
        lbryId: info.lbry_id,
      });
    });

    if (!this.props.accessToken) this.props.fetchAccessToken();
  }

  showAccessToken() {
    this.setState({
      accessTokenHidden: false,
    });
  }

  render() {
    let ver, osName, platform, newVerLink;

    const { navigate, user } = this.props;

    if (this.state.versionInfo) {
      ver = this.state.versionInfo;
      if (ver.os_system == "Darwin") {
        osName = parseInt(ver.os_release.match(/^\d+/)) < 16
          ? "Mac OS X"
          : "Mac OS";

        platform = `${osName} ${ver.os_release}`;
        newVerLink = "https://lbry.io/get/lbry.dmg";
      } else if (ver.os_system == "Linux") {
        platform = `Linux (${ver.platform})`;
        newVerLink = "https://lbry.io/get/lbry.deb";
      } else {
        platform = `Windows (${ver.platform})`;
        newVerLink = "https://lbry.io/get/lbry.msi";
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
            <p>
              <Link
                href="https://lbry.io/faq"
                label={__("Read the FAQ")}
                icon="icon-question"
                button="alt"
              />
            </p>
          </div>
        </section>
        <section className="card">
          <div className="card__title-primary">
            <h3>{__("Get Live Help")}</h3>
          </div>
          <div className="card__content">
            <p>
              {__("Live help is available most hours in the")}
              {" "}<strong>#help</strong>
              {" "}{__("channel of our Slack chat room.")}
            </p>
            <p>
              <Link
                button="alt"
                label={__("Join Our Slack")}
                icon="icon-slack"
                href="https://slack.lbry.io"
              />
            </p>
          </div>
        </section>
        <section className="card">
          <div className="card__title-primary">
            <h3>{__("Report a Bug")}</h3>
          </div>
          <div className="card__content">
            <p>{__("Did you find something wrong?")}</p>
            <p>
              <Link
                onClick={() => navigate("report")}
                label={__("Submit a Bug Report")}
                icon="icon-bug"
                button="alt"
              />
            </p>
            <div className="meta">
              {__("Thanks! LBRY is made by its users.")}
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card__title-primary"><h3>{__("About")}</h3></div>
          <div className="card__content">
            {this.state.upgradeAvailable === null
              ? ""
              : this.state.upgradeAvailable
                ? <p>
                    {__("A newer version of LBRY is available.")}
                    {" "}<Link href={newVerLink} label={__("Download now!")} />
                  </p>
                : <p>{__("Your copy of LBRY is up to date.")}</p>}
            {this.state.uiVersion && ver
              ? <table className="table-standard">
                  <tbody>
                    <tr>
                      <th>{__("App")}</th>
                      <td>{this.state.uiVersion}</td>
                    </tr>
                    <tr>
                      <th>{__("Daemon (lbrynet)")}</th>
                      <td>{ver.lbrynet_version}</td>
                    </tr>
                    <tr>
                      <th>{__("Wallet (lbryum)")}</th>
                      <td>{ver.lbryum_version}</td>
                    </tr>
                    <tr>
                      <th>{__("Connected Email")}</th>
                      <td>
                        {user && user.primary_email
                          ? user.primary_email
                          : <span className="empty">{__("none")}</span>}
                      </td>
                    </tr>
                    <tr>
                      <th>{__("Platform")}</th>
                      <td>{platform}</td>
                    </tr>
                    <tr>
                      <th>{__("Installation ID")}</th>
                      <td>{this.state.lbryId}</td>
                    </tr>
                    <tr>
                      <th>{__("Access Token")}</th>
                      <td>
                        {this.state.accessTokenHidden &&
                          <Link
                            label={__("show")}
                            onClick={this.showAccessToken.bind(this)}
                          />}
                        {!this.state.accessTokenHidden &&
                          this.props.accessToken}
                      </td>
                    </tr>
                  </tbody>
                </table>
              : <BusyMessage message={__("Looking up version info")} />}
          </div>
        </section>
      </main>
    );
  }
}

export default HelpPage;
