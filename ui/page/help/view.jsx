// @TODO: Customize advice based on OS
// @flow
import * as icons from 'constants/icons';
import * as React from 'react';
// @if TARGET='app'
import { shell } from 'electron';
import WalletBackup from 'component/walletBackup';
// @endif
import { Lbry } from 'lbry-redux';
import Native from 'native';
import Button from 'component/button';
import Page from 'component/page';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';

type DeamonSettings = {
  data_dir: string | any,
};

type Props = {
  deamonSettings: DeamonSettings,
  accessToken: string,
  fetchAccessToken: () => void,
  doAuth: () => void,
  user: any,
};

type VersionInfo = {
  os_system: string,
  os_release: string,
  platform: string,
  lbrynet_version: string,
};

type State = {
  versionInfo: VersionInfo | any,
  lbryId: String | any,
  uiVersion: ?string,
  upgradeAvailable: ?boolean,
  accessTokenHidden: ?boolean,
};

class HelpPage extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      versionInfo: null,
      lbryId: null,
      uiVersion: null,
      upgradeAvailable: null,
      accessTokenHidden: true,
    };

    (this: any).showAccessToken = this.showAccessToken.bind(this);
    (this: any).openLogFile = this.openLogFile.bind(this);
  }

  componentDidMount() {
    // @if TARGET='app'
    Native.getAppVersionInfo().then(({ localVersion, upgradeAvailable }) => {
      this.setState({
        uiVersion: localVersion,
        upgradeAvailable,
      });
    });
    if (!this.props.accessToken) this.props.fetchAccessToken();
    // @endif

    Lbry.version().then(info => {
      this.setState({
        versionInfo: info,
      });
    });
    Lbry.status().then(info => {
      this.setState({
        lbryId: info.installation_id,
      });
    });
  }

  showAccessToken() {
    this.setState({
      accessTokenHidden: false,
    });
  }

  openLogFile(userHomeDirectory: string) {
    const logFileName = 'lbrynet.log';
    const os = this.state.versionInfo.os_system;
    if (os === 'Darwin' || os === 'Linux') {
      shell.openItem(`${userHomeDirectory}/${logFileName}`);
    } else {
      shell.openItem(`${userHomeDirectory}\\${logFileName}`);
    }
  }

  render() {
    let ver;
    let osName;
    let platform;
    let newVerLink;

    const { accessToken, doAuth, user, deamonSettings } = this.props;
    const { data_dir: dataDirectory } = deamonSettings;

    if (this.state.versionInfo) {
      ver = this.state.versionInfo;
      if (ver.os_system === 'Darwin') {
        osName = parseInt(ver.os_release.match(/^\d+/), 10) < 16 ? 'Mac OS X' : 'Mac OS';

        platform = `${osName} ${ver.os_release}`;
        newVerLink = 'https://lbry.com/get/lbry.dmg';
      } else if (ver.os_system === 'Linux') {
        platform = `Linux (${ver.platform})`;
        newVerLink = 'https://lbry.com/get/lbry.deb';
      } else {
        platform = `Windows (${ver.platform})`;
        newVerLink = 'https://lbry.com/get/lbry.msi';
      }
    } else {
      ver = null;
    }

    return (
      <Page>
        <Card
          title={__('Read the FAQ')}
          subtitle={__('Our FAQ answers many common questions.')}
          actions={
            <div className="section__actions">
              <Button
                href="https://lbry.com/faq/lbry-basics"
                label={__('Read the App Basics FAQ')}
                icon={icons.HELP}
                button="inverse"
              />
              <Button href="https://lbry.com/faq" label={__('View all LBRY FAQs')} icon={icons.HELP} button="inverse" />
            </div>
          }
        />

        <Card
          title={__('Find Assistance')}
          subtitle={
            <I18nMessage tokens={{ channel: <strong>#help</strong> }}>
              Live help is available most hours in the %channel% channel of our Discord chat room. Or you can always
              email us at help@lbry.com.
            </I18nMessage>
          }
          actions={
            <div className="section__actions">
              <Button button="inverse" label={__('Join Our Chat')} icon={icons.CHAT} href="https://chat.lbry.com" />
              <Button button="inverse" label={__('Email Us')} icon={icons.WEB} href="mailto:help@lbry.com" />
            </div>
          }
        />

        <Card
          title={__('Report a Bug or Suggest a New Feature')}
          subtitle={
            <p>
              {__('Did you find something wrong? Think LBRY could add something useful and cool?')}{' '}
              <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/support" />.
            </p>
          }
          actions={
            <div className="section__actions">
              <Button navigate="/$/report" label={__('Help Us Out')} button="inverse" />
            </div>
          }
        />

        {/* @if TARGET='app' */}
        <Card
          title={__('View your Log')}
          subtitle={
            <p>
              {__('Did something go wrong? Have a look in your log file, or send it to')}{' '}
              <Button button="link" label={__('support')} href="https://lbry.com/faq/support" />.
            </p>
          }
          actions={
            <div className="section__actions">
              <Button button="inverse" label={__('Open Log')} onClick={() => this.openLogFile(dataDirectory)} />
              <Button button="link" label={__('Open Log Folder')} onClick={() => shell.openItem(dataDirectory)} />
            </div>
          }
        />

        <WalletBackup />
        {/* @endif */}

        <section className="card">
          <header className="table__header">
            <h2 className="section__title">{__('About')}</h2>

            {this.state.upgradeAvailable !== null && this.state.upgradeAvailable ? (
              <p className="section__subtitle">
                {__('A newer version of LBRY is available.')}{' '}
                <Button button="link" href={newVerLink} label={__('Download now!')} />
              </p>
            ) : (
              <p className="section__subtitle">{__('Your LBRY app is up to date.')}</p>
            )}
          </header>

          <table className="table table--stretch">
            <tbody>
              <tr>
                <td>{__('App')}</td>
                <td>{this.state.uiVersion}</td>
              </tr>
              <tr>
                <td>{__('Daemon (lbrynet)')}</td>
                <td>{ver ? ver.lbrynet_version : __('Loading...')}</td>
              </tr>
              <tr>
                <td>{__('Connected Email')}</td>
                <td>
                  {user && user.primary_email ? (
                    <React.Fragment>
                      {user.primary_email}{' '}
                      <Button
                        button="link"
                        href={`https://lbry.com/list/edit/${accessToken}`}
                        label={__('Update mailing preferences')}
                      />
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <span className="empty">{__('none')} </span>
                      <Button button="link" onClick={() => doAuth()} label={__('set email')} />
                    </React.Fragment>
                  )}
                </td>
              </tr>
              <tr>
                <td>{__('Reward Eligible')}</td>
                <td>{user && user.is_reward_approved ? __('Yes') : __('No')}</td>
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
                    <Button button="link" label={__('View')} onClick={this.showAccessToken} />
                  )}
                  {!this.state.accessTokenHidden && accessToken && (
                    <div>
                      <p>{accessToken}</p>
                      <div className="alert-text">
                        {__('This is equivalent to a password. Do not post or share this.')}
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </Page>
    );
  }
}

export default HelpPage;
