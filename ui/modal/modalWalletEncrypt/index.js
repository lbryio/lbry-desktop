import { connect } from 'react-redux';
import { selectWalletEncryptSucceeded, selectWalletEncryptResult } from 'redux/selectors/wallet';
import { doWalletStatus, doWalletEncrypt } from 'redux/actions/wallet';
import { doHideModal } from 'redux/actions/app';
import ModalWalletEncrypt from './view';

const select = (state) => ({
  walletEncryptSucceded: selectWalletEncryptSucceeded(state),
  walletEncryptResult: selectWalletEncryptResult(state),
});

const perform = (dispatch) => ({
  closeModal: () => dispatch(doHideModal()),
  encryptWallet: (password) => dispatch(doWalletEncrypt(password)),
  updateWalletStatus: () => dispatch(doWalletStatus()),
});

export default connect(select, perform)(ModalWalletEncrypt);
