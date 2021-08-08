import { connect } from 'react-redux';
import { doClearCache, doNotifyEncryptWallet, doNotifyDecryptWallet, doNotifyForgetPassword } from 'redux/actions/app';
import { selectAllowAnalytics } from 'redux/selectors/app';
import { doEnterSettingsPage, doExitSettingsPage } from 'redux/actions/settings';
import { makeSelectClientSetting, selectDaemonSettings } from 'redux/selectors/settings';
import { doWalletStatus, selectWalletIsEncrypted, SETTINGS } from 'lbry-redux';
import SettingsAdvancedPage from './view';

const select = (state) => ({
  daemonSettings: selectDaemonSettings(state),
  allowAnalytics: selectAllowAnalytics(state),
  walletEncrypted: selectWalletIsEncrypted(state),
  syncEnabled: makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state),
});

const perform = (dispatch) => ({
  clearCache: () => dispatch(doClearCache()),
  encryptWallet: () => dispatch(doNotifyEncryptWallet()),
  decryptWallet: () => dispatch(doNotifyDecryptWallet()),
  updateWalletStatus: () => dispatch(doWalletStatus()),
  confirmForgetPassword: (modalProps) => dispatch(doNotifyForgetPassword(modalProps)),
  enterSettings: () => dispatch(doEnterSettingsPage()),
  exitSettings: () => dispatch(doExitSettingsPage()),
});

export default connect(select, perform)(SettingsAdvancedPage);
