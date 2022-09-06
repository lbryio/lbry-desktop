// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import Page from 'component/page';
import SettingAccount from 'component/settingAccount';
import SettingAppearance from 'component/settingAppearance';
import SettingContent from 'component/settingContent';
import SettingSystem from 'component/settingSystem';
import SettingUnauthenticated from 'component/settingUnauthenticated';
import Yrbl from 'component/yrbl';

type DaemonSettings = {
  download_dir: string,
  share_usage_data: boolean,
};

type Props = {
  daemonSettings: DaemonSettings,
  isAuthenticated: boolean,
  enterSettings: () => void,
  exitSettings: () => void,
};

class SettingsPage extends React.PureComponent<Props> {
  componentDidMount() {
    const { enterSettings } = this.props;
    enterSettings();
  }

  componentWillUnmount() {
    const { exitSettings } = this.props;
    exitSettings();
  }

  render() {
    const { daemonSettings, isAuthenticated } = this.props;
    const noDaemonSettings = !daemonSettings || Object.keys(daemonSettings).length === 0;

    return (
      <Page
        noFooter
        settingsPage
        noSideNavigation
        backout={{ title: __('Settings'), backLabel: __('Save') }}
        className="card-stack"
      >
        {!isAuthenticated && IS_WEB && (
          <>
            <SettingUnauthenticated />
            <div className="main--empty">
              <Yrbl
                type="happy"
                title={__('Sign up for full control')}
                subtitle={__('Unlock new buttons that change things.')}
                actions={
                  <div className="section__actions">
                    <Button button="primary" icon={ICONS.SIGN_UP} label={__('Sign Up')} navigate={`/$/${PAGES.AUTH}`} />
                  </div>
                }
              />
            </div>
          </>
        )}

        {!IS_WEB && noDaemonSettings ? (
          <section className="card card--section">
            <div className="card__title card__title--deprecated">{__('Failed to load settings.')}</div>
          </section>
        ) : (
          <div className={classnames('card-stack', { 'card--disabled': IS_WEB && !isAuthenticated })}>
            <SettingAppearance />
            <SettingAccount />
            <SettingContent />
            <SettingSystem />
          </div>
        )}
      </Page>
    );
  }
}

export default SettingsPage;
