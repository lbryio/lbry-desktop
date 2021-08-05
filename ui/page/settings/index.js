import { connect } from 'react-redux';
import { doClearCache, doToggle3PAnalytics, doOpenModal } from 'redux/actions/app';
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
import {
  makeSelectClientSetting,
  selectDaemonSettings,
  selectLanguage,
  selectShowMatureContent,
} from 'redux/selectors/settings';
import { selectMyChannelUrls, SETTINGS } from 'lbry-redux';
import SettingsPage from './view';
import { selectUserVerifiedEmail, selectUser } from 'redux/selectors/user';

const select = (state) => ({
  daemonSettings: selectDaemonSettings(state),
  allowAnalytics: selectAllowAnalytics(state),
  isAuthenticated: selectUserVerifiedEmail(state),
  showNsfw: selectShowMatureContent(state),
  currentTheme: makeSelectClientSetting(SETTINGS.THEME)(state),
  themes: makeSelectClientSetting(SETTINGS.THEMES)(state),
  automaticDarkModeEnabled: makeSelectClientSetting(SETTINGS.AUTOMATIC_DARK_MODE_ENABLED)(state),
  clock24h: makeSelectClientSetting(SETTINGS.CLOCK_24H)(state),
  autoplay: makeSelectClientSetting(SETTINGS.AUTOPLAY)(state),
  autoDownload: makeSelectClientSetting(SETTINGS.AUTO_DOWNLOAD)(state),
  hideBalance: makeSelectClientSetting(SETTINGS.HIDE_BALANCE)(state),
  floatingPlayer: makeSelectClientSetting(SETTINGS.FLOATING_PLAYER)(state),
  hideReposts: makeSelectClientSetting(SETTINGS.HIDE_REPOSTS)(state),
  darkModeTimes: makeSelectClientSetting(SETTINGS.DARK_MODE_TIMES)(state),
  language: selectLanguage(state),
  myChannelUrls: selectMyChannelUrls(state),
  user: selectUser(state),
});

const perform = (dispatch) => ({
  setDaemonSetting: (key, value) => dispatch(doSetDaemonSetting(key, value)),
  clearDaemonSetting: (key) => dispatch(doClearDaemonSetting(key)),
  toggle3PAnalytics: (allow) => dispatch(doToggle3PAnalytics(allow)),
  clearCache: () => dispatch(doClearCache()),
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  clearPlayingUri: () => dispatch(doSetPlayingUri({ uri: null })),
  setDarkTime: (time, options) => dispatch(doSetDarkTime(time, options)),
  openModal: (id, params) => dispatch(doOpenModal(id, params)),
  enterSettings: () => dispatch(doEnterSettingsPage()),
  exitSettings: () => dispatch(doExitSettingsPage()),
});

export default connect(select, perform)(SettingsPage);
