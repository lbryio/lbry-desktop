import { connect } from 'react-redux';
import { doWalletStatus, doWalletEncrypt, selectWalletEncryptSucceeded, selectWalletEncryptResult } from 'lbry-redux';
import { doHideModal } from 'redux/actions/app';
import ModalWalletEncrypt from './view';

const select = state => ({
  walletEncryptSucceded: selectWalletEncryptSucceeded(state),
  walletEncryptResult: selectWalletEncryptResult(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  encryptWallet: password => dispatch(doWalletEncrypt(password)),
  updateWalletStatus: () => dispatch(doWalletStatus()),
});

export default connect(
  select,
  perform
)(ModalWalletEncrypt);
