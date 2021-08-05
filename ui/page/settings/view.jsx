// @flow
import * as PAGES from 'constants/pages';
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import { SETTINGS } from 'lbry-redux';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import Page from 'component/page';
import SettingAccount from 'component/settingAccount';
import SettingAppearance from 'component/settingAppearance';
import SettingSystem from 'component/settingSystem';
import FileSelector from 'component/common/file-selector';
import Card from 'component/common/card';
import classnames from 'classnames';
import { SIMPLE_SITE } from 'config';
import { Lbryio } from 'lbryinc';
import Yrbl from 'component/yrbl';
import { getStripeEnvironment } from 'util/stripe';

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
  clearDaemonSetting: (string) => void,
  setClientSetting: (string, SetDaemonSettingArg) => void,
  toggle3PAnalytics: (boolean) => void,
  daemonSettings: DaemonSettings,
  allowAnalytics: boolean,
  showNsfw: boolean,
  isAuthenticated: boolean,
  instantPurchaseEnabled: boolean,
  instantPurchaseMax: Price,
  autoplay: boolean,
  floatingPlayer: boolean,
  hideReposts: ?boolean,
  clearPlayingUri: () => void,
  openModal: (string) => void,
  enterSettings: () => void,
  exitSettings: () => void,
  myChannelUrls: ?Array<string>,
  user: User,
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

  clearDaemonSetting(name: string): void {
    this.props.clearDaemonSetting(name);
  }

  render() {
    const {
      daemonSettings,
      allowAnalytics,
      showNsfw,
      isAuthenticated,
      autoplay,
      // autoDownload,
      setDaemonSetting,
      setClientSetting,
      toggle3PAnalytics,
      floatingPlayer,
      hideReposts,
      clearPlayingUri,
      openModal,
      myChannelUrls,
      user,
    } = this.props;
    const noDaemonSettings = !daemonSettings || Object.keys(daemonSettings).length === 0;

    const newStyle = true;
    return newStyle ? (
      <Page noFooter noSideNavigation backout={{ title: __('Settings'), backLabel: __('Done') }} className="card-stack">
        <SettingAppearance />
        <SettingAccount />
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
              title={__('Download directory')}
              actions={
                <React.Fragment>
                  <FileSelector
                    type="openDirectory"
                    currentPath={daemonSettings.download_dir}
                    onFileChosen={(newDirectory: WebFile) => {
                      setDaemonSetting('download_dir', newDirectory.path);
                    }}
                  />
                  <p className="help">{__('LBRY downloads will be saved here.')}</p>
                </React.Fragment>
              }
            />
            {/* @endif */}

            <Card
              title={__('Content settings')}
              actions={
                <React.Fragment>
                  <FormField
                    type="checkbox"
                    name="floating_player"
                    onChange={() => {
                      setClientSetting(SETTINGS.FLOATING_PLAYER, !floatingPlayer);
                      clearPlayingUri();
                    }}
                    checked={floatingPlayer}
                    label={__('Floating video player')}
                    helper={__('Keep content playing in the corner when navigating to a different page.')}
                  />

                  <FormField
                    type="checkbox"
                    name="autoplay"
                    onChange={() => setClientSetting(SETTINGS.AUTOPLAY, !autoplay)}
                    checked={autoplay}
                    label={__('Autoplay media files')}
                    helper={__(
                      'Autoplay video and audio files when navigating to a file, as well as the next related item when a file finishes playing.'
                    )}
                  />
                  {!SIMPLE_SITE && (
                    <>
                      <FormField
                        type="checkbox"
                        name="hide_reposts"
                        onChange={(e) => {
                          if (isAuthenticated) {
                            let param = e.target.checked ? { add: 'noreposts' } : { remove: 'noreposts' };
                            Lbryio.call('user_tag', 'edit', param);
                          }

                          setClientSetting(SETTINGS.HIDE_REPOSTS, !hideReposts);
                        }}
                        checked={hideReposts}
                        label={__('Hide reposts')}
                        helper={__(
                          'You will not see reposts by people you follow or receive email notifying about them.'
                        )}
                      />

                      {/*
                        <FormField
                          type="checkbox"
                          name="show_anonymous"
                          onChange={() => setClientSetting(SETTINGS.SHOW_ANONYMOUS, !showAnonymous)}
                          checked={showAnonymous}
                          label={__('Show anonymous content')}
                          helper={__('Anonymous content is published without a channel.')}
                        />
                      */}

                      <FormField
                        type="checkbox"
                        name="show_nsfw"
                        onChange={() =>
                          !IS_WEB || showNsfw
                            ? setClientSetting(SETTINGS.SHOW_MATURE, !showNsfw)
                            : openModal(MODALS.CONFIRM_AGE)
                        }
                        checked={showNsfw}
                        label={__('Show mature content')}
                        helper={__(
                          'Mature content may include nudity, intense sexuality, profanity, or other adult content. By displaying mature content, you are affirming you are of legal age to view mature content in your country or jurisdiction.  '
                        )}
                      />
                    </>
                  )}
                </React.Fragment>
              }
            />

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

            {/* @if TARGET='web' */}
            {user && getStripeEnvironment() && (
              <Card
                title={__('Bank Accounts')}
                subtitle={__('Connect a bank account to receive tips and compensation in your local currency')}
                actions={
                  <div className="section__actions">
                    <Button
                      button="secondary"
                      label={__('Manage')}
                      icon={ICONS.SETTINGS}
                      navigate={`/$/${PAGES.SETTINGS_STRIPE_ACCOUNT}`}
                    />
                  </div>
                }
              />
            )}
            {/* @endif */}

            {/* @if TARGET='web' */}
            {isAuthenticated && getStripeEnvironment() && (
              <Card
                title={__('Payment Methods')}
                subtitle={__('Add a credit card to tip creators in their local currency')}
                actions={
                  <div className="section__actions">
                    <Button
                      button="secondary"
                      label={__('Manage')}
                      icon={ICONS.SETTINGS}
                      navigate={`/$/${PAGES.SETTINGS_STRIPE_CARD}`}
                    />
                  </div>
                }
              />
            )}
            {/* @endif */}

            {(isAuthenticated || !IS_WEB) && (
              <>
                <Card
                  title={__('Notifications')}
                  actions={
                    <div className="section__actions">
                      <Button
                        button="secondary"
                        label={__('Manage')}
                        icon={ICONS.SETTINGS}
                        navigate={`/$/${PAGES.SETTINGS_NOTIFICATIONS}`}
                      />
                    </div>
                  }
                />

                <Card
                  title={__('Blocked and muted channels')}
                  actions={
                    <div className="section__actions">
                      <Button
                        button="secondary"
                        label={__('Manage')}
                        icon={ICONS.SETTINGS}
                        navigate={`/$/${PAGES.SETTINGS_BLOCKED_MUTED}`}
                      />
                    </div>
                  }
                />

                {myChannelUrls && myChannelUrls.length > 0 && (
                  <Card
                    title={__('Creator settings')}
                    actions={
                      <div className="section__actions">
                        <Button
                          button="secondary"
                          label={__('Manage')}
                          icon={ICONS.SETTINGS}
                          navigate={`/$/${PAGES.SETTINGS_CREATOR}`}
                        />
                      </div>
                    }
                  />
                )}

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
