import { connect } from 'react-redux';
import {
  doUserPasswordReset,
  selectPasswordResetSuccess,
  selectPasswordResetPending,
  selectPasswordResetError,
} from 'lbryinc';
import UserSignIn from './view';

const select = state => ({
  passwordResetSuccess: selectPasswordResetSuccess(state),
  passwordResetIsPending: selectPasswordResetPending(state),
  passwordResetError: selectPasswordResetError(state),
});

export default connect(select, {
  doUserPasswordReset,
})(UserSignIn);
