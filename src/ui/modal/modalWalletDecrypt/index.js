import { connect } from 'react-redux';
import { doWalletStatus, doWalletDecrypt, selectWalletDecryptSucceeded } from 'lbry-redux';
import { doHideModal, doPasswordSaved } from 'redux/actions/app';
import ModalWalletDecrypt from './view';
import { selectIsPasswordSaved } from 'redux/selectors/app';

const select = state => ({
  walletDecryptSucceded: selectWalletDecryptSucceeded(state),
  isPasswordSaved: selectIsPasswordSaved(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  decryptWallet: password => dispatch(doWalletDecrypt(password)),
  updateWalletStatus: () => dispatch(doWalletStatus()),
  setPasswordSaved: saved => dispatch(doPasswordSaved(saved)),
});

export default connect(
  select,
  perform
)(ModalWalletDecrypt);
