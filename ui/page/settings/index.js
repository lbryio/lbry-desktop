import { connect } from 'react-redux';
import { doClearCache, doNotifyForgetPassword, doToggle3PAnalytics, doOpenModal } from 'redux/actions/app';
import { selectAllowAnalytics } from 'redux/selectors/app';
import {
  doSetDaemonSetting,
  doClearDaemonSetting,
  doSetClientSetting,
  doSetDarkTime,
  doEnterSettingsPage,
  doExitSettingsPage,
} from 'redux/actions/settings';
import { doSetPlayingUri } from 'redux/actions/content';
import { makeSelectClientSetting, selectDaemonSettings, selectLanguage } from 'redux/selectors/settings';
import { doWalletStatus, selectWalletIsEncrypted, SETTINGS } from 'lbry-redux';
import { selectBlockedChannelsCount } from 'redux/selectors/blocked';
import SettingsPage from './view';
import { selectUserVerifiedEmail } from 'redux/selectors/user';

const select = state => ({
  daemonSettings: selectDaemonSettings(state),
  allowAnalytics: selectAllowAnalytics(state),
  isAuthenticated: selectUserVerifiedEmail(state),
  showNsfw: makeSelectClientSetting(SETTINGS.SHOW_MATURE)(state),
  currentTheme: makeSelectClientSetting(SETTINGS.THEME)(state),
  themes: makeSelectClientSetting(SETTINGS.THEMES)(state),
  automaticDarkModeEnabled: makeSelectClientSetting(SETTINGS.AUTOMATIC_DARK_MODE_ENABLED)(state),
  autoplay: makeSelectClientSetting(SETTINGS.AUTOPLAY)(state),
  walletEncrypted: selectWalletIsEncrypted(state),
  autoDownload: makeSelectClientSetting(SETTINGS.AUTO_DOWNLOAD)(state),
  userBlockedChannelsCount: selectBlockedChannelsCount(state),
  hideBalance: makeSelectClientSetting(SETTINGS.HIDE_BALANCE)(state),
  floatingPlayer: makeSelectClientSetting(SETTINGS.FLOATING_PLAYER)(state),
  hideReposts: makeSelectClientSetting(SETTINGS.HIDE_REPOSTS)(state),
  darkModeTimes: makeSelectClientSetting(SETTINGS.DARK_MODE_TIMES)(state),
  language: selectLanguage(state),
});

const perform = dispatch => ({
  setDaemonSetting: (key, value) => dispatch(doSetDaemonSetting(key, value)),
  clearDaemonSetting: key => dispatch(doClearDaemonSetting(key)),
  toggle3PAnalytics: allow => dispatch(doToggle3PAnalytics(allow)),
  clearCache: () => dispatch(doClearCache()),
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  updateWalletStatus: () => dispatch(doWalletStatus()),
  confirmForgetPassword: modalProps => dispatch(doNotifyForgetPassword(modalProps)),
  clearPlayingUri: () => dispatch(doSetPlayingUri({ uri: null })),
  setDarkTime: (time, options) => dispatch(doSetDarkTime(time, options)),
  openModal: (id, params) => dispatch(doOpenModal(id, params)),
  enterSettings: () => dispatch(doEnterSettingsPage()),
  exitSettings: () => dispatch(doExitSettingsPage()),
});

export default connect(select, perform)(SettingsPage);
