import { connect } from 'react-redux';
import { doWalletStatus } from 'redux/actions/wallet';
import { selectWalletIsEncrypted } from 'redux/selectors/wallet';
import {
  doClearCache,
  doNotifyDecryptWallet,
  doNotifyEncryptWallet,
  doNotifyForgetPassword,
  doToggle3PAnalytics,
} from 'redux/actions/app';
import { doSetDaemonSetting, doClearDaemonSetting, doFindFFmpeg } from 'redux/actions/settings';
import { selectAllowAnalytics } from 'redux/selectors/app';
import { selectDaemonSettings, selectFfmpegStatus, selectFindingFFmpeg } from 'redux/selectors/settings';
import { selectUserVerifiedEmail } from 'redux/selectors/user';

import SettingSystem from './view';

const select = (state) => ({
  daemonSettings: selectDaemonSettings(state),
  ffmpegStatus: selectFfmpegStatus(state),
  findingFFmpeg: selectFindingFFmpeg(state),
  walletEncrypted: selectWalletIsEncrypted(state),
  isAuthenticated: selectUserVerifiedEmail(state),
  allowAnalytics: selectAllowAnalytics(state),
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
  toggle3PAnalytics: (allow) => dispatch(doToggle3PAnalytics(allow)),
});

export default connect(select, perform)(SettingSystem);
