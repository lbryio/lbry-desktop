// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import { FormField } from 'component/common/form';
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

type SetDaemonSettingArg = boolean | string | number;

type DaemonSettings = {
  download_dir: string,
  share_usage_data: boolean,
};

type Props = {
  setDaemonSetting: (string, ?SetDaemonSettingArg) => void,
  toggle3PAnalytics: (boolean) => void,
  daemonSettings: DaemonSettings,
  allowAnalytics: boolean,
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

  setDaemonSetting(name: string, value: ?SetDaemonSettingArg): void {
    this.props.setDaemonSetting(name, value);
  }

  render() {
    const {
      daemonSettings,
      allowAnalytics,
      isAuthenticated,
      // autoDownload,
      setDaemonSetting,
      toggle3PAnalytics,
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
            {/* @if TARGET='app' */}
            <Card
              title={__('Share usage and diagnostic data')}
              subtitle={
                <React.Fragment>
                  {__(
                    `This is information like error logging, performance tracking, and usage statistics. It includes your IP address and basic system details, but no other identifying information (unless you sign in to lbry.tv)`
                  )}{' '}
                  <Button button="link" label={__('Learn more')} href="https://lbry.com/privacypolicy" />
                </React.Fragment>
              }
              actions={
                <>
                  <FormField
                    type="checkbox"
                    name="share_internal"
                    onChange={() => setDaemonSetting('share_usage_data', !daemonSettings.share_usage_data)}
                    checked={daemonSettings.share_usage_data}
                    label={<React.Fragment>{__('Allow the app to share data to LBRY.inc')}</React.Fragment>}
                    helper={
                      isAuthenticated
                        ? __('Internal sharing is required while signed in.')
                        : __('Internal sharing is required to participate in rewards programs.')
                    }
                    disabled={isAuthenticated && daemonSettings.share_usage_data}
                  />
                  <FormField
                    type="checkbox"
                    name="share_third_party"
                    onChange={(e) => toggle3PAnalytics(e.target.checked)}
                    checked={allowAnalytics}
                    label={__('Allow the app to access third party analytics platforms')}
                    helper={__('We use detailed analytics to improve all aspects of the LBRY experience.')}
                  />
                </>
              }
            />
            {/* @endif */}

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
