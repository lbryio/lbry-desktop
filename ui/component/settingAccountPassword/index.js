import { connect } from 'react-redux';
import {
  selectUser,
  selectPasswordSetIsPending,
  selectPasswordSetSuccess,
  selectPasswordSetError,
  doUserPasswordSet,
  doClearPasswordEntries,
} from 'lbryinc';
import { doToast } from 'lbry-redux';
import UserSignIn from './view';

const select = state => ({
  user: selectUser(state),
  passwordSetPending: selectPasswordSetIsPending(state),
  passwordSetSuccess: selectPasswordSetSuccess(state),
  passwordSetError: selectPasswordSetError(state),
});

export default connect(select, {
  doUserPasswordSet,
  doToast,
  doClearPasswordEntries,
})(UserSignIn);
