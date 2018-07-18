import { connect } from 'react-redux';
import {
  doHideNotification,
  doWalletUnlock,
  selectWalletUnlockPending,
  selectWalletUnlockSucceeded,
} from 'lbry-redux';
import { doQuit } from 'redux/actions/app';
import ModalWalletUnlock from './view';

const select = state => ({
  walletUnlockSucceded: selectWalletUnlockSucceeded(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideNotification()),
  quit: () => dispatch(doQuit()),
  unlockWallet: password => dispatch(doWalletUnlock(password)),
});

export default connect(
  select,
  perform
)(ModalWalletUnlock);
