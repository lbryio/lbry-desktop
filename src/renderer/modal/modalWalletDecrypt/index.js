import { connect } from 'react-redux';
import { doWalletStatus, doWalletDecrypt, selectWalletDecryptSucceeded } from 'lbry-redux';
import { doHideModal } from 'redux/actions/app';
import ModalWalletDecrypt from './view';

const select = state => ({
  walletDecryptSucceded: selectWalletDecryptSucceeded(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  decryptWallet: password => dispatch(doWalletDecrypt(password)),
  updateWalletStatus: () => dispatch(doWalletStatus()),
});

export default connect(
  select,
  perform
)(ModalWalletDecrypt);
