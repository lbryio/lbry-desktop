import { connect } from 'react-redux';
import {
  doWalletStatus,
  doWalletEncrypt,
  doWalletDecrypt,
  selectWalletEncryptSucceeded,
  selectWalletEncryptPending,
  selectWalletEncryptResult,
  selectWalletIsEncrypted,
  selectHasTransactions,
} from 'lbry-redux';
import WalletSecurityAndSync from './view';
import {
  doCheckSync,
  doGetSync,
  doSetDefaultAccount,
  doSyncApply,
  selectHasSyncedWallet,
  selectGetSyncIsPending,
  selectSetSyncIsPending,
  selectSyncApplyIsPending,
  selectSyncApplyErrorMessage,
  selectSyncData,
  selectSyncHash,
  selectHashChanged,
  selectUser,
} from 'lbryinc';
import { doSetClientSetting } from 'redux/actions/settings';

const select = state => ({
  walletEncryptSucceeded: selectWalletEncryptSucceeded(state),
  walletEncryptPending: selectWalletEncryptPending(state),
  walletEncryptResult: selectWalletEncryptResult(state),
  walletEncrypted: selectWalletIsEncrypted(state),
  walletHasTransactions: selectHasTransactions(state),
  user: selectUser(state),
  hasSyncedWallet: selectHasSyncedWallet(state),
  getSyncIsPending: selectGetSyncIsPending(state),
  setSyncIsPending: selectSetSyncIsPending(state),
  syncApplyIsPending: selectSyncApplyIsPending(state),
  syncApplyErrorMessage: selectSyncApplyErrorMessage(state),
  syncData: selectSyncData(state),
  syncHash: selectSyncHash(state),
  hashChanged: selectHashChanged(state),
});

const perform = dispatch => ({
  encryptWallet: password => dispatch(doWalletEncrypt(password)),
  decryptWallet: () => dispatch(doWalletDecrypt()),
  updateWalletStatus: () => dispatch(doWalletStatus()),
  syncApply: (hash, data, password) => dispatch(doSyncApply(hash, data, password)),
  getSync: password => dispatch(doGetSync(password, true)),
  checkSync: () => dispatch(doCheckSync()),
  setDefaultAccount: () => dispatch(doSetDefaultAccount()),
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
});

export default connect(
  select,
  perform
)(WalletSecurityAndSync);
