// @flow
import * as React from 'react';
import Page from 'component/page';
import SettingAccount from 'component/settingAccount';
import SettingAppearance from 'component/settingAppearance';
import SettingContent from 'component/settingContent';
import SettingSystem from 'component/settingSystem';

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
    const { daemonSettings } = this.props;
    const noDaemonSettings = !daemonSettings || Object.keys(daemonSettings).length === 0;

    return (
      <Page
        noFooter
        settingsPage
        noSideNavigation
        backout={{ title: __('Settings'), backLabel: __('Back') }}
        className="card-stack"
      >
        {noDaemonSettings ? (
          <section className="card card--section">
            <div className="card__title card__title--deprecated">{__('Failed to load settings.')}</div>
          </section>
        ) : (
          <div className={'card-stack'}>
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
