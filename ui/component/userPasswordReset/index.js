import { connect } from 'react-redux';
import {
  selectPasswordResetSuccess,
  selectPasswordResetIsPending,
  selectPasswordResetError,
  selectEmailToVerify,
} from 'redux/selectors/user';
import { doUserPasswordReset, doClearPasswordEntry, doClearEmailEntry } from 'redux/actions/user';
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
