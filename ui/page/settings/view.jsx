// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import Button from 'component/button';
import Page from 'component/page';
import SettingAccount from 'component/settingAccount';
import SettingAppearance from 'component/settingAppearance';
import SettingContent from 'component/settingContent';
import SettingSystem from 'component/settingSystem';
import Card from 'component/common/card';
import classnames from 'classnames';
import Yrbl from 'component/yrbl';

type Price = {
  currency: string,
  amount: number,
};

type DaemonSettings = {
  download_dir: string,
  share_usage_data: boolean,
};

type Props = {
  daemonSettings: DaemonSettings,
  isAuthenticated: boolean,
  instantPurchaseEnabled: boolean,
  instantPurchaseMax: Price,
  openModal: (string) => void,
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
    const {
      daemonSettings,
      isAuthenticated,
      // autoDownload,
    } = this.props;
    const noDaemonSettings = !daemonSettings || Object.keys(daemonSettings).length === 0;

    const newStyle = true;
    return newStyle ? (
      <Page noFooter noSideNavigation backout={{ title: __('Settings'), backLabel: __('Done') }} className="card-stack">
        <SettingAppearance />
        <SettingAccount />
        <SettingContent />
        <SettingSystem />
      </Page>
    ) : (
      <Page
        noFooter
        noSideNavigation
        backout={{
          title: __('Settings'),
          backLabel: __('Done'),
        }}
        className="card-stack"
      >
        {!isAuthenticated && IS_WEB && (
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
        )}

        {!IS_WEB && noDaemonSettings ? (
          <section className="card card--section">
            <div className="card__title card__title--deprecated">{__('Failed to load settings.')}</div>
          </section>
        ) : (
          <div className={classnames('card-stack', { 'card--disabled': IS_WEB && !isAuthenticated })}>
            {(isAuthenticated || !IS_WEB) && (
              <>
                <Card
                  title={__('Advanced settings')}
                  actions={
                    <div className="section__actions">
                      <Button
                        button="secondary"
                        label={__('Manage')}
                        icon={ICONS.SETTINGS}
                        navigate={`/$/${PAGES.SETTINGS_ADVANCED}`}
                      />
                    </div>
                  }
                />
              </>
            )}
          </div>
        )}
      </Page>
    );
  }
}

export default SettingsPage;
