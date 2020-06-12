import { connect } from 'react-redux';
import {
  doUserPasswordReset,
  selectPasswordResetSuccess,
  selectPasswordResetIsPending,
  selectPasswordResetError,
  doClearPasswordEntry,
  doClearEmailEntry,
  selectEmailToVerify,
} from 'lbryinc';
import { doToast } from 'redux/actions/notifications';
import UserSignIn from './view';

const select = state => ({
  passwordResetSuccess: selectPasswordResetSuccess(state),
  passwordResetIsPending: selectPasswordResetIsPending(state),
  passwordResetError: selectPasswordResetError(state),
  emailToVerify: selectEmailToVerify(state),
});

export default connect(select, {
  doUserPasswordReset,
  doToast,
  doClearPasswordEntry,
  doClearEmailEntry,
})(UserSignIn);
