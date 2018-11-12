import { connect } from 'react-redux';
import * as settings from 'constants/settings';
import { doClearCache, doNotifyEncryptWallet, doNotifyDecryptWallet } from 'redux/actions/app';
import {
  doSetDaemonSetting,
  doSetClientSetting,
  doGetThemes,
  doChangeLanguage,
} from 'redux/actions/settings';
import {
  makeSelectClientSetting,
  selectDaemonSettings,
  selectLanguages,
  selectosNotificationsEnabled,
} from 'redux/selectors/settings';
import { selectCurrentLanguage } from 'redux/selectors/app';
import { doWalletStatus, selectWalletIsEncrypted } from 'lbry-redux';
import SettingsPage from './view';

const select = state => ({
  daemonSettings: selectDaemonSettings(state),
  showNsfw: makeSelectClientSetting(settings.SHOW_NSFW)(state),
  instantPurchaseEnabled: makeSelectClientSetting(settings.INSTANT_PURCHASE_ENABLED)(state),
  instantPurchaseMax: makeSelectClientSetting(settings.INSTANT_PURCHASE_MAX)(state),
  currentTheme: makeSelectClientSetting(settings.THEME)(state),
  themes: makeSelectClientSetting(settings.THEMES)(state),
  language: selectCurrentLanguage(state),
  languages: selectLanguages(state),
  automaticDarkModeEnabled: makeSelectClientSetting(settings.AUTOMATIC_DARK_MODE_ENABLED)(state),
  autoplay: makeSelectClientSetting(settings.AUTOPLAY)(state),
  walletEncrypted: selectWalletIsEncrypted(state),
  osNotificationsEnabled: selectosNotificationsEnabled(state),
  autoDownload: makeSelectClientSetting(settings.AUTO_DOWNLOAD)(state),
});

const perform = dispatch => ({
  setDaemonSetting: (key, value) => dispatch(doSetDaemonSetting(key, value)),
  clearCache: () => dispatch(doClearCache()),
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  getThemes: () => dispatch(doGetThemes()),
  changeLanguage: newLanguage => dispatch(doChangeLanguage(newLanguage)),
  encryptWallet: () => dispatch(doNotifyEncryptWallet()),
  decryptWallet: () => dispatch(doNotifyDecryptWallet()),
  updateWalletStatus: () => dispatch(doWalletStatus()),
});

export default connect(
  select,
  perform
)(SettingsPage);
