import { connect } from 'react-redux';
import { doClearCache, doNotifyEncryptWallet, doNotifyDecryptWallet, doNotifyForgetPassword } from 'redux/actions/app';
import { selectAllowAnalytics } from 'redux/selectors/app';
import {
  doSetDaemonSetting,
  doClearDaemonSetting,
  doSetClientSetting,
  doFindFFmpeg,
  doEnterSettingsPage,
  doExitSettingsPage,
} from 'redux/actions/settings';
import {
  makeSelectClientSetting,
  selectLanguage,
  selectDaemonSettings,
  selectFfmpegStatus,
  selectFindingFFmpeg,
} from 'redux/selectors/settings';
import { doWalletStatus, selectWalletIsEncrypted, SETTINGS } from 'lbry-redux';
import SettingsAdvancedPage from './view';
import { selectUserVerifiedEmail } from 'redux/selectors/user';

const select = (state) => ({
  daemonSettings: selectDaemonSettings(state),
  allowAnalytics: selectAllowAnalytics(state),
  isAuthenticated: selectUserVerifiedEmail(state),
  instantPurchaseEnabled: makeSelectClientSetting(SETTINGS.INSTANT_PURCHASE_ENABLED)(state),
  instantPurchaseMax: makeSelectClientSetting(SETTINGS.INSTANT_PURCHASE_MAX)(state),
  walletEncrypted: selectWalletIsEncrypted(state),
  hideBalance: makeSelectClientSetting(SETTINGS.HIDE_BALANCE)(state),
  ffmpegStatus: selectFfmpegStatus(state),
  findingFFmpeg: selectFindingFFmpeg(state),
  language: selectLanguage(state),
  syncEnabled: makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state),
});

const perform = (dispatch) => ({
  setDaemonSetting: (key, value) => dispatch(doSetDaemonSetting(key, value)),
  clearDaemonSetting: (key) => dispatch(doClearDaemonSetting(key)),
  clearCache: () => dispatch(doClearCache()),
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  encryptWallet: () => dispatch(doNotifyEncryptWallet()),
  decryptWallet: () => dispatch(doNotifyDecryptWallet()),
  updateWalletStatus: () => dispatch(doWalletStatus()),
  confirmForgetPassword: (modalProps) => dispatch(doNotifyForgetPassword(modalProps)),
  findFFmpeg: () => dispatch(doFindFFmpeg()),
  enterSettings: () => dispatch(doEnterSettingsPage()),
  exitSettings: () => dispatch(doExitSettingsPage()),
});

export default connect(select, perform)(SettingsAdvancedPage);
