import { connect } from 'react-redux';
import {
  doUserPasswordReset,
  selectPasswordResetSuccess,
  selectPasswordResetIsPending,
  selectPasswordResetError,
} from 'lbryinc';
import { doToast } from 'lbry-redux';
import UserSignIn from './view';

const select = state => ({
  passwordResetSuccess: selectPasswordResetSuccess(state),
  passwordResetIsPending: selectPasswordResetIsPending(state),
  passwordResetError: selectPasswordResetError(state),
});

export default connect(select, {
  doUserPasswordReset,
  doToast,
})(UserSignIn);
