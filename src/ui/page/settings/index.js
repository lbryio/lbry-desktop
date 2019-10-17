import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { doClearCache, doNotifyEncryptWallet, doNotifyDecryptWallet, doNotifyForgetPassword } from 'redux/actions/app';
import { doSetDaemonSetting, doSetClientSetting, doSetDarkTime } from 'redux/actions/settings';
import { doSetPlayingUri } from 'redux/actions/content';
import { makeSelectClientSetting, selectDaemonSettings, selectosNotificationsEnabled } from 'redux/selectors/settings';
import { doWalletStatus, selectWalletIsEncrypted, selectBlockedChannelsCount } from 'lbry-redux';
import SettingsPage from './view';

const select = state => ({
  daemonSettings: selectDaemonSettings(state),
  showNsfw: makeSelectClientSetting(SETTINGS.SHOW_MATURE)(state),
  instantPurchaseEnabled: makeSelectClientSetting(SETTINGS.INSTANT_PURCHASE_ENABLED)(state),
  instantPurchaseMax: makeSelectClientSetting(SETTINGS.INSTANT_PURCHASE_MAX)(state),
  currentTheme: makeSelectClientSetting(SETTINGS.THEME)(state),
  themes: makeSelectClientSetting(SETTINGS.THEMES)(state),
  automaticDarkModeEnabled: makeSelectClientSetting(SETTINGS.AUTOMATIC_DARK_MODE_ENABLED)(state),
  autoplay: makeSelectClientSetting(SETTINGS.AUTOPLAY)(state),
  walletEncrypted: selectWalletIsEncrypted(state),
  osNotificationsEnabled: selectosNotificationsEnabled(state),
  autoDownload: makeSelectClientSetting(SETTINGS.AUTO_DOWNLOAD)(state),
  supportOption: makeSelectClientSetting(SETTINGS.SUPPORT_OPTION)(state),
  userBlockedChannelsCount: selectBlockedChannelsCount(state),
  hideBalance: makeSelectClientSetting(SETTINGS.HIDE_BALANCE)(state),
  floatingPlayer: makeSelectClientSetting(SETTINGS.FLOATING_PLAYER)(state),
  darkModeTimes: makeSelectClientSetting(SETTINGS.DARK_MODE_TIMES)(state),
});

const perform = dispatch => ({
  setDaemonSetting: (key, value) => dispatch(doSetDaemonSetting(key, value)),
  clearCache: () => dispatch(doClearCache()),
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  encryptWallet: () => dispatch(doNotifyEncryptWallet()),
  decryptWallet: () => dispatch(doNotifyDecryptWallet()),
  updateWalletStatus: () => dispatch(doWalletStatus()),
  confirmForgetPassword: modalProps => dispatch(doNotifyForgetPassword(modalProps)),
  clearPlayingUri: () => dispatch(doSetPlayingUri(null)),
  setDarkTime: (time, options) => dispatch(doSetDarkTime(time, options)),
});

export default connect(
  select,
  perform
)(SettingsPage);
