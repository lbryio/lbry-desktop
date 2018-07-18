import { connect } from 'react-redux';
import {
  doHideNotification,
  doWalletStatus,
  doWalletEncrypt,
  selectWalletEncryptPending,
  selectWalletEncryptSucceeded,
  selectWalletEncryptResult,
} from 'lbry-redux';
import ModalWalletEncrypt from './view';

const select = state => ({
  walletEncryptSucceded: selectWalletEncryptSucceeded(state),
  walletEncryptResult: selectWalletEncryptResult(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideNotification()),
  encryptWallet: password => dispatch(doWalletEncrypt(password)),
  updateWalletStatus: () => dispatch(doWalletStatus()),
});

export default connect(
  select,
  perform
)(ModalWalletEncrypt);
