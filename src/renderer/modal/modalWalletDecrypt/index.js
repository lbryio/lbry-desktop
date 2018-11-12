import { connect } from 'react-redux';
import {
  doHideNotification,
  doWalletStatus,
  doWalletDecrypt,
  selectWalletDecryptSucceeded,
} from 'lbry-redux';
import ModalWalletDecrypt from './view';

const select = state => ({
  walletDecryptSucceded: selectWalletDecryptSucceeded(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideNotification()),
  decryptWallet: password => dispatch(doWalletDecrypt(password)),
  updateWalletStatus: () => dispatch(doWalletStatus()),
});

export default connect(
  select,
  perform
)(ModalWalletDecrypt);
