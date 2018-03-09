// @TODO: Customize advice based on OS
import React from 'react';
import lbry from 'lbry.js';
import Link from 'component/link';
import { BusyMessage } from 'component/common';
import Icon from 'component/common/icon';
import Page from 'component/page';

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

  componentDidMount() {
    lbry.getAppVersionInfo().then(({ remoteVersion, localVersion, upgradeAvailable }) => {
      this.setState({
        uiVersion: localVersion,
        upgradeAvailable,
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

    const { accessToken, doAuth, user } = this.props;

    if (this.state.versionInfo) {
      ver = this.state.versionInfo;
      if (ver.os_system == 'Darwin') {
        osName = parseInt(ver.os_release.match(/^\d+/)) < 16 ? 'Mac OS X' : 'Mac OS';

        platform = `${osName} ${ver.os_release}`;
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
      <Page>
        <section className="card card--section">
          <div className="card__title">
            {__('Read the FAQ')}
          </div>
          <p className="card__subtitle">{__('Our FAQ answers many common questions.')}</p>

          <div className="card__actions">
            <Link
              href="https://lbry.io/faq"
              label={__('Read the FAQ')}
              icon="HelpCircle"
              button="alt"
            />
          </div>
        </section>

        <section className="card card--section">
          <div className="card__title">
            {__('Get Live Help')}
          </div>
          <p className="card__subtitle">
          {__('Live help is available most hours in the')} <strong>#help</strong>{' '}
          {__('channel of our Discord chat room.')}
          </p>
          <div className="card__actions">
            <Link
              label={__('Join Our Chat')}
              icon="MessageCircle"
              href="https://chat.lbry.io"
            />
          </div>
        </section>

        <section className="card card--section">
          <div className="card__title">
            {__('Report a Bug')}
          </div>
          <p className="card__subtitle">{__('Did you find something wrong?')}</p>

          <div className="card__actions">
            <Link
              navigate="/report"
              label={__('Submit a Bug Report')}
              icon="Flag"
              button="alt"
            />
          </div>
          <div className="card__meta">{__('Thanks! LBRY is made by its users.')}</div>
        </section>

        <section className="card card--section">
          <div className="card__title">
            {__('About')}
          </div>
          {this.state.upgradeAvailable !== null && this.state.upgradeAvailable ? (
            <div className="card__subtitle">
              {__('A newer version of LBRY is available.')}{' '}
              <Link fakeLink href={newVerLink} label={__('Download now!')} />
            </div>
          ) : (
            <div className="card__subtitle">{__('Your LBRY app is up to date.')}</div>
          )}

          {this.state.uiVersion && ver ? (
            <table className="table table--stretch table--help">
              <tbody>
                <tr>
                  <td>{__('App')}</td>
                  <td>{this.state.uiVersion}</td>
                </tr>
                <tr>
                  <td>{__('Daemon (lbrynet)')}</td>
                  <td>{ver.lbrynet_version}</td>
                </tr>
                <tr>
                  <td>{__('Wallet (lbryum)')}</td>
                  <td>{ver.lbryum_version}</td>
                </tr>
                <tr>
                  <td>{__('Connected Email')}</td>
                  <td>
                    {user && user.primary_email ? (
                      user.primary_email
                    ) : (
                      <span>
                        <span className="empty">{__('none')} </span>
                        (<Link onClick={() => doAuth()} label={__('set email')} />)
                      </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>{__('Reward Eligible')}</td>
                  <td>
                    {user && user.is_reward_approved ? (
                      __("Yes")
                    ) : (
                      __("No")
                    )}
                  </td>
                </tr>
                <tr>
                  <td>{__('Platform')}</td>
                  <td>{platform}</td>
                </tr>
                <tr>
                  <td>{__('Installation ID')}</td>
                  <td>{this.state.lbryId}</td>
                </tr>
                <tr>
                  <td>{__('Access Token')}</td>
                  <td>
                    {this.state.accessTokenHidden && (
                      <Link fakeLink label={__('View')} onClick={this.showAccessToken.bind(this)} />
                    )}
                    {!this.state.accessTokenHidden &&
                      accessToken && (
                        <div>
                          <p>{accessToken}</p>
                          <div className="help">
                            {__('This is equivalent to a password. Do not post or share this.')}
                          </div>
                        </div>
                      )}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <BusyMessage message={__('Looking up version info')} />
          )}
        </section>
      </Page>
    );
  }
}

export default HelpPage;
