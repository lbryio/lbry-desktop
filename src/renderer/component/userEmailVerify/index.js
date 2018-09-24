import { connect } from 'react-redux';
import {
  selectEmailVerifyIsPending,
  selectEmailToVerify,
  selectEmailVerifyErrorMessage,
  doUserEmailVerify,
  doUserEmailVerifyFailure,
  doUserResendVerificationEmail,
} from 'lbryinc';
import UserEmailVerify from './view';

const select = state => ({
  isPending: selectEmailVerifyIsPending(state),
  email: selectEmailToVerify(state),
  errorMessage: selectEmailVerifyErrorMessage(state),
});

const perform = dispatch => ({
  verifyUserEmail: (code, recaptcha) => dispatch(doUserEmailVerify(code, recaptcha)),
  verifyUserEmailFailure: error => dispatch(doUserEmailVerifyFailure(error)),
  resendVerificationEmail: email => dispatch(doUserResendVerificationEmail(email)),
});

export default connect(
  select,
  perform
)(UserEmailVerify);
