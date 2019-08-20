import { connect } from 'react-redux';
import { doWalletUnlock, selectWalletUnlockSucceeded } from 'lbry-redux';
import { doQuit, doHideModal, doPasswordSaved } from 'redux/actions/app';
import ModalWalletUnlock from './view';

const select = state => ({
  walletUnlockSucceded: selectWalletUnlockSucceeded(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  quit: () => dispatch(doQuit()),
  unlockWallet: password => dispatch(doWalletUnlock(password)),
  setPasswordSaved: saved => dispatch(doPasswordSaved(saved)),
});

export default connect(
  select,
  perform
)(ModalWalletUnlock);
