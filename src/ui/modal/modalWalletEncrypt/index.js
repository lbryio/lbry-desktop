import { connect } from 'react-redux';
import { doWalletStatus, doWalletEncrypt, selectWalletEncryptSucceeded, selectWalletEncryptResult } from 'lbry-redux';
import { doHideModal } from 'redux/actions/app';
import { doGetSync, doSyncEncryptAndDecrypt } from 'lbryinc';
import { makeSelectClientSetting } from 'redux/selectors/settings';

import ModalWalletEncrypt from './view';

const select = state => ({
  walletEncryptSucceded: selectWalletEncryptSucceeded(state),
  walletEncryptResult: selectWalletEncryptResult(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  encryptWallet: password => dispatch(doWalletEncrypt(password)),
  updateWalletStatus: () => dispatch(doWalletStatus()),
  getSync: password => dispatch(doGetSync(password)),
  syncAndEncrypt: (oldPassword, newPassword, encrypt) =>
    dispatch(doSyncEncryptAndDecrypt(oldPassword, newPassword, encrypt)),
});

export default connect(
  select,
  perform
)(ModalWalletEncrypt);
