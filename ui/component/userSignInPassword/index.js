import { connect } from 'react-redux';
import {
  selectUser,
  selectUserIsPending,
  selectEmailToVerify,
  selectEmailNewErrorMessage,
  doUserSignIn,
  doClearEmailEntry,
} from 'lbryinc';
import UserSignIn from './view';

const select = state => ({
  user: selectUser(state),
  userFetchPending: selectUserIsPending(state),
  emailToVerify: selectEmailToVerify(state),
  errorMessage: selectEmailNewErrorMessage(state),
});

export default connect(select, {
  doUserSignIn,
  doClearEmailEntry,
})(UserSignIn);
