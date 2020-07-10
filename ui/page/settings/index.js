import { connect } from 'react-redux';
import {
  doClearCache,
  doNotifyEncryptWallet,
  doNotifyDecryptWallet,
  doNotifyForgetPassword,
  doToggle3PAnalytics,
  doOpenModal,
} from 'redux/actions/app';
import { selectAllowAnalytics } from 'redux/selectors/app';
import {
  doSetDaemonSetting,
  doClearDaemonSetting,
  doSetClientSetting,
  doSetDarkTime,
  doFindFFmpeg,
  doSyncClientSettings,
} from 'redux/actions/settings';
import { doSetPlayingUri } from 'redux/actions/content';
import {
  makeSelectClientSetting,
  selectDaemonSettings,
  selectFfmpegStatus,
  selectFindingFFmpeg,
} from 'redux/selectors/settings';
import { doWalletStatus, selectWalletIsEncrypted, SETTINGS } from 'lbry-redux';
import { selectBlockedChannelsCount } from 'redux/selectors/blocked';
import SettingsPage from './view';
import { selectUserVerifiedEmail } from 'redux/selectors/user';

const select = state => ({
  daemonSettings: selectDaemonSettings(state),
  allowAnalytics: selectAllowAnalytics(state),
  isAuthenticated: selectUserVerifiedEmail(state),
  showNsfw: makeSelectClientSetting(SETTINGS.SHOW_MATURE)(state),
  instantPurchaseEnabled: makeSelectClientSetting(SETTINGS.INSTANT_PURCHASE_ENABLED)(state),
  instantPurchaseMax: makeSelectClientSetting(SETTINGS.INSTANT_PURCHASE_MAX)(state),
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
  ffmpegStatus: selectFfmpegStatus(state),
  findingFFmpeg: selectFindingFFmpeg(state),
  language: makeSelectClientSetting(SETTINGS.LANGUAGE)(state),
  syncEnabled: makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state),
});

const perform = dispatch => ({
  setDaemonSetting: (key, value) => dispatch(doSetDaemonSetting(key, value)),
  syncSettings: () => dispatch(doSyncClientSettings()),
  clearDaemonSetting: key => dispatch(doClearDaemonSetting(key)),
  toggle3PAnalytics: allow => dispatch(doToggle3PAnalytics(allow)),
  clearCache: () => dispatch(doClearCache()),
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  encryptWallet: () => dispatch(doNotifyEncryptWallet()),
  decryptWallet: () => dispatch(doNotifyDecryptWallet()),
  updateWalletStatus: () => dispatch(doWalletStatus()),
  confirmForgetPassword: modalProps => dispatch(doNotifyForgetPassword(modalProps)),
  clearPlayingUri: () => dispatch(doSetPlayingUri(null)),
  setDarkTime: (time, options) => dispatch(doSetDarkTime(time, options)),
  findFFmpeg: () => dispatch(doFindFFmpeg()),
  openModal: (id, params) => dispatch(doOpenModal(id, params)),
});

export default connect(select, perform)(SettingsPage);
