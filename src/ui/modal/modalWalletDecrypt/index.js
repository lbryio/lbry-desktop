import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { doWalletStatus, doWalletDecrypt, selectWalletDecryptSucceeded } from 'lbry-redux';
import { doHideModal } from 'redux/actions/app';
import ModalWalletDecrypt from './view';
import { doGetSync, doSyncEncryptAndDecrypt } from 'lbryinc';
import { makeSelectClientSetting } from 'redux/selectors/settings';

const select = state => ({
  walletDecryptSucceded: selectWalletDecryptSucceeded(state),
  syncEnabled: makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  decryptWallet: password => dispatch(doWalletDecrypt(password)),
  updateWalletStatus: () => dispatch(doWalletStatus()),
  getSync: password => dispatch(doGetSync(password)),
  syncAndDecrypt: (oldPassword, newPassword, encrypt) =>
    dispatch(doSyncEncryptAndDecrypt(oldPassword, newPassword, encrypt)),
});

export default connect(
  select,
  perform
)(ModalWalletDecrypt);
