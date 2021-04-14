// @flow
import * as PAGES from 'constants/pages';
// import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import { SETTINGS } from 'lbry-redux';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import Page from 'component/page';
import SettingLanguage from 'component/settingLanguage';
import FileSelector from 'component/common/file-selector';
import SyncToggle from 'component/syncToggle';
import HomepageSelector from 'component/homepageSelector';
import Card from 'component/common/card';
import SettingAccountPassword from 'component/settingAccountPassword';
import classnames from 'classnames';
import { getPasswordFromCookie } from 'util/saved-passwords';
// $FlowFixMe
import homepages from 'homepages';
// import { Lbryio } from 'lbryinc';
import Yrbl from 'component/yrbl';

type Price = {
  currency: string,
  amount: number,
};

type SetDaemonSettingArg = boolean | string | number;

type DarkModeTimes = {
  from: { hour: string, min: string, formattedTime: string },
  to: { hour: string, min: string, formattedTime: string },
};

type OptionTimes = {
  fromTo: string,
  time: string,
};

type DaemonSettings = {
  download_dir: string,
  share_usage_data: boolean,
};

type Props = {
  setDaemonSetting: (string, ?SetDaemonSettingArg) => void,
  clearDaemonSetting: (string) => void,
  setClientSetting: (string, SetDaemonSettingArg) => void,
  toggle3PAnalytics: (boolean) => void,
  clearCache: () => Promise<any>,
  daemonSettings: DaemonSettings,
  allowAnalytics: boolean,
  showNsfw: boolean,
  isAuthenticated: boolean,
  instantPurchaseEnabled: boolean,
  instantPurchaseMax: Price,
  currentTheme: string,
  themes: Array<string>,
  automaticDarkModeEnabled: boolean,
  clock24h: boolean,
  autoplay: boolean,
  updateWalletStatus: () => void,
  walletEncrypted: boolean,
  confirmForgetPassword: ({}) => void,
  floatingPlayer: boolean,
  hideReposts: ?boolean,
  clearPlayingUri: () => void,
  darkModeTimes: DarkModeTimes,
  setDarkTime: (string, {}) => void,
  openModal: (string) => void,
  language?: string,
  enterSettings: () => void,
  exitSettings: () => void,
};

type State = {
  clearingCache: boolean,
  storedPassword: boolean,
};

class SettingsPage extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      clearingCache: false,
      storedPassword: false,
    };

    (this: any).onThemeChange = this.onThemeChange.bind(this);
    (this: any).onAutomaticDarkModeChange = this.onAutomaticDarkModeChange.bind(this);
    (this: any).onChangeTime = this.onChangeTime.bind(this);
    (this: any).onConfirmForgetPassword = this.onConfirmForgetPassword.bind(this);
  }

  componentDidMount() {
    const { isAuthenticated, enterSettings } = this.props;

    if (isAuthenticated || !IS_WEB) {
      this.props.updateWalletStatus();
      getPasswordFromCookie().then((p) => {
        if (typeof p === 'string') {
          this.setState({ storedPassword: true });
        }
      });
    }
    enterSettings();
  }

  componentWillUnmount() {
    const { exitSettings } = this.props;
    exitSettings();
  }

  onThemeChange(event: SyntheticInputEvent<*>) {
    const { value } = event.target;

    if (value === 'dark') {
      this.onAutomaticDarkModeChange(false);
    }

    this.props.setClientSetting(SETTINGS.THEME, value);
  }

  onAutomaticDarkModeChange(value: boolean) {
    this.props.setClientSetting(SETTINGS.AUTOMATIC_DARK_MODE_ENABLED, value);
  }

  onClock24hChange(value: boolean) {
    this.props.setClientSetting(SETTINGS.CLOCK_24H, value);
  }

  onConfirmForgetPassword() {
    const { confirmForgetPassword } = this.props;
    confirmForgetPassword({
      callback: () => {
        this.setState({ storedPassword: false });
      },
    });
  }

  onChangeTime(event: SyntheticInputEvent<*>, options: OptionTimes) {
    const { value } = event.target;

    this.props.setDarkTime(value, options);
  }

  formatHour(time: string, clock24h: boolean) {
    if (clock24h) {
      return `${time}:00`;
    }

    const now = new Date(0, 0, 0, Number(time));

    const hour = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit' });

    return hour;
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
      //   showNsfw,
      isAuthenticated,
      currentTheme,
      themes,
      automaticDarkModeEnabled,
      clock24h,
      autoplay,
      walletEncrypted,
      // autoDownload,
      setDaemonSetting,
      setClientSetting,
      toggle3PAnalytics,
      floatingPlayer,
      //   hideReposts,
      clearPlayingUri,
      darkModeTimes,
      clearCache,
      //   openModal,
    } = this.props;
    const { storedPassword } = this.state;
    const noDaemonSettings = !daemonSettings || Object.keys(daemonSettings).length === 0;
    const startHours = ['18', '19', '20', '21'];
    const endHours = ['5', '6', '7', '8'];

    return (
      <Page
        noFooter
        noSideNavigation
        backout={{
          title: __('Settings'),
          backLabel: __('Done'),
        }}
        className="card-stack"
      >
        <Card title={__('Language')} actions={<SettingLanguage />} />
        {homepages && Object.keys(homepages).length > 1 && (
          <Card title={__('Homepage')} actions={<HomepageSelector />} />
        )}

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
            {isAuthenticated && <SettingAccountPassword />}
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
            <Card
              title={__('Sync')}
              subtitle={
                walletEncrypted && !storedPassword && storedPassword !== ''
                  ? __("To enable Sync, close LBRY completely and check 'Remember Password' during wallet unlock.")
                  : null
              }
              actions={<SyncToggle disabled={walletEncrypted && !storedPassword && storedPassword !== ''} />}
            />
            {/* @endif */}

            <Card
              title={__('Appearance')}
              actions={
                <React.Fragment>
                  <fieldset-section>
                    <FormField
                      name="theme_select"
                      type="select"
                      label={__('Theme')}
                      onChange={this.onThemeChange}
                      value={currentTheme}
                      disabled={automaticDarkModeEnabled}
                    >
                      {themes.map((theme) => (
                        <option key={theme} value={theme}>
                          {theme === 'light' ? __('Light') : __('Dark')}
                        </option>
                      ))}
                    </FormField>
                  </fieldset-section>
                  <fieldset-section>
                    <FormField
                      type="checkbox"
                      name="automatic_dark_mode"
                      onChange={() => this.onAutomaticDarkModeChange(!automaticDarkModeEnabled)}
                      checked={automaticDarkModeEnabled}
                      label={__('Automatic dark mode')}
                    />
                    {automaticDarkModeEnabled && (
                      <fieldset-group class="fieldset-group--smushed">
                        <FormField
                          type="select"
                          name="automatic_dark_mode_range_start"
                          onChange={(value) => this.onChangeTime(value, { fromTo: 'from', time: 'hour' })}
                          value={darkModeTimes.from.hour}
                          label={__('From --[initial time]--')}
                        >
                          {startHours.map((time) => (
                            <option key={time} value={time}>
                              {this.formatHour(time, clock24h)}
                            </option>
                          ))}
                        </FormField>
                        <FormField
                          type="select"
                          name="automatic_dark_mode_range_end"
                          label={__('To --[final time]--')}
                          onChange={(value) => this.onChangeTime(value, { fromTo: 'to', time: 'hour' })}
                          value={darkModeTimes.to.hour}
                        >
                          {endHours.map((time) => (
                            <option key={time} value={time}>
                              {this.formatHour(time, clock24h)}
                            </option>
                          ))}
                        </FormField>
                      </fieldset-group>
                    )}
                  </fieldset-section>
                  <fieldset-section>
                    <FormField
                      type="checkbox"
                      name="clock24h"
                      onChange={() => this.onClock24hChange(!clock24h)}
                      checked={clock24h}
                      label={__('24-hour clock')}
                    />
                  </fieldset-section>
                </React.Fragment>
              }
            />

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

                  {/* <FormField
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
                    helper={__('You will not see reposts by people you follow or receive email notifying about them.')}
                  /> */}

                  {/* <FormField
                    type="checkbox"
                    name="show_anonymous"
                    onChange={() => setClientSetting(SETTINGS.SHOW_ANONYMOUS, !showAnonymous)}
                    checked={showAnonymous}
                    label={__('Show anonymous content')}
                    helper={__('Anonymous content is published without a channel.')}
                  /> */}

                  {/* <FormField
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
                  /> */}
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

            <Card
              title={__('Application cache')}
              subtitle={
                <p className="section__subtitle">
                  {__(
                    'This will clear the application cache, and might fix issues you are having. Your wallet will not be affected. '
                  )}
                </p>
              }
              actions={
                <Button
                  button="secondary"
                  icon={ICONS.ALERT}
                  label={this.state.clearingCache ? __('Clearing') : __('Clear Cache')}
                  onClick={clearCache}
                  disabled={this.state.clearingCache}
                />
              }
            />
          </div>
        )}
      </Page>
    );
  }
}

export default SettingsPage;
