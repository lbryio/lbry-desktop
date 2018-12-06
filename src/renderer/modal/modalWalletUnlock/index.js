import { connect } from 'react-redux';
import { doWalletUnlock, selectWalletUnlockPending, selectWalletUnlockSucceeded } from 'lbry-redux';
import { doQuit, doHideModal } from 'redux/actions/app';
import ModalWalletUnlock from './view';

const select = state => ({
  walletUnlockSucceded: selectWalletUnlockSucceeded(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  quit: () => dispatch(doQuit()),
  unlockWallet: password => dispatch(doWalletUnlock(password)),
});

export default connect(
  select,
  perform
)(ModalWalletUnlock);
