import { connect } from 'react-redux';
import { doWalletStatus, selectWalletIsEncrypted } from 'lbry-redux';
import { doClearCache, doNotifyDecryptWallet, doNotifyEncryptWallet, doNotifyForgetPassword } from 'redux/actions/app';
import { doSetDaemonSetting, doClearDaemonSetting, doFindFFmpeg } from 'redux/actions/settings';
import { selectDaemonSettings, selectFfmpegStatus, selectFindingFFmpeg } from 'redux/selectors/settings';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import SettingSystem from './view';

const select = (state) => ({
  daemonSettings: selectDaemonSettings(state),
  ffmpegStatus: selectFfmpegStatus(state),
  findingFFmpeg: selectFindingFFmpeg(state),
  walletEncrypted: selectWalletIsEncrypted(state),
  isAuthenticated: selectUserVerifiedEmail(state),
});

const perform = (dispatch) => ({
  setDaemonSetting: (key, value) => dispatch(doSetDaemonSetting(key, value)),
  clearDaemonSetting: (key) => dispatch(doClearDaemonSetting(key)),
  clearCache: () => dispatch(doClearCache()),
  findFFmpeg: () => dispatch(doFindFFmpeg()),
  encryptWallet: () => dispatch(doNotifyEncryptWallet()),
  decryptWallet: () => dispatch(doNotifyDecryptWallet()),
  updateWalletStatus: () => dispatch(doWalletStatus()),
  confirmForgetPassword: (modalProps) => dispatch(doNotifyForgetPassword(modalProps)),
});

export default connect(select, perform)(SettingSystem);
