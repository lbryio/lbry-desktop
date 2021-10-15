// @flow
import { SITE_NAME, SIMPLE_SITE, SITE_HELP_EMAIL } from 'config';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import * as React from 'react';
// @if TARGET='app'
import { shell } from 'electron';
import WalletBackup from 'component/walletBackup';
// @endif
import Lbry from 'lbry';
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

    Lbry.version().then((info) => {
      this.setState({
        versionInfo: info,
      });
    });
    Lbry.status().then((info) => {
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
      shell.openPath(`${userHomeDirectory}/${logFileName}`);
    } else {
      shell.openPath(`${userHomeDirectory}\\${logFileName}`);
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
      } else if (process.env.APPIMAGE !== undefined) {
        platform = `Linux (AppImage)`;
        newVerLink = 'https://lbry.com/get/lbry.AppImage';
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
      <Page className="card-stack">
        <Card
          title={SIMPLE_SITE ? __('Visit the %SITE_NAME% Help Hub', { SITE_NAME }) : __('Read the FAQ')}
          subtitle={
            SIMPLE_SITE
              ? __('Our support posts answer many common questions.')
              : __('Our FAQ answers many common questions.')
          }
          actions={
            <div className="section__actions">
              {SIMPLE_SITE ? (
                <Button
                  href="https://odysee.com/@OdyseeHelp:b"
                  label={__('View %SITE_NAME% Help Hub', { SITE_NAME })}
                  icon={ICONS.HELP}
                  button="secondary"
                />
              ) : (
                <>
                  <Button
                    href="https://lbry.com/faq/lbry-basics"
                    label={__('Read the App Basics FAQ')}
                    icon={ICONS.HELP}
                    button="secondary"
                  />
                  <Button
                    href="https://lbry.com/faq"
                    label={__('View all LBRY FAQs')}
                    icon={ICONS.HELP}
                    button="secondary"
                  />
                </>
              )}
            </div>
          }
        />

        <Card
          title={__('Find assistance')}
          subtitle={
            <I18nMessage tokens={{ channel: <strong>#help</strong>, help_email: SITE_HELP_EMAIL }}>
              Live help is available most hours in the %channel% channel of our Discord chat room. Or you can always
              email us at %help_email%.
            </I18nMessage>
          }
          actions={
            <div className="section__actions">
              <Button button="secondary" label={__('Join Our Chat')} icon={ICONS.CHAT} href="https://chat.lbry.com" />
              <Button button="secondary" label={__('Email Us')} icon={ICONS.WEB} href={`mailto:${SITE_HELP_EMAIL}`} />
            </div>
          }
        />

        <Card
          title={__('Report a bug or suggest something')}
          subtitle={
            <React.Fragment>
              {__('Did you find something wrong? Think LBRY could add something useful and cool?')}
            </React.Fragment>
          }
          actions={
            <div className="section__actions">
              <Button navigate="/$/report" label={__('Submit Feedback')} icon={ICONS.FEEDBACK} button="secondary" />
            </div>
          }
        />

        {/* @if TARGET='app' */}
        <Card
          title={__('View your log')}
          subtitle={
            <I18nMessage
              tokens={{
                support_link: <Button button="link" label={__('support')} href="https://lbry.com/faq/support" />,
              }}
            >
              Did something go wrong? Have a look in your log file, or send it to %support_link%.
            </I18nMessage>
          }
          actions={
            <div className="section__actions">
              <Button
                button="secondary"
                label={__('Open Log')}
                icon={ICONS.OPEN_LOG}
                onClick={() => this.openLogFile(dataDirectory)}
              />
              <Button
                button="secondary"
                label={__('Open Log Folder')}
                icon={ICONS.OPEN_LOG_FOLDER}
                onClick={() => shell.openPath(dataDirectory)}
              />
            </div>
          }
        />

        <WalletBackup />
        {/* @endif */}
        {!SIMPLE_SITE && (
          <>
            <Card
              title={__('About --[About section in Help Page]--')}
              subtitle={
                this.state.upgradeAvailable !== null && this.state.upgradeAvailable ? (
                  <span>
                    {__('A newer version of LBRY is available.')}{' '}
                    <Button button="link" href={newVerLink} label={__('Download now!')} />
                  </span>
                ) : null
              }
              isBodyList
              body={
                <div className="table__wrapper">
                  <table className="table table--stretch">
                    <tbody>
                      <tr>
                        <td>{__('App')}</td>
                        <td>
                          {this.state.uiVersion ? this.state.uiVersion + ' - ' : ''}
                          <Button
                            button="link"
                            label={__('Changelog')}
                            href="https://github.com/lbryio/lbry-desktop/blob/master/CHANGELOG.md"
                          />
                        </td>
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
                                navigate={`/$/${PAGES.SETTINGS_NOTIFICATIONS}`}
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
                              <div className="help--warning">
                                {__('This is equivalent to a password. Do not post or share this.')}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              }
            />
          </>
        )}
      </Page>
    );
  }
}

export default HelpPage;
