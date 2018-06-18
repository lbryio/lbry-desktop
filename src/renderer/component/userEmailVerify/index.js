import { connect } from 'react-redux';
import {
  doUserEmailVerify,
  doUserEmailVerifyFailure,
  doUserResendVerificationEmail,
} from 'redux/actions/user';
import {
  selectEmailVerifyIsPending,
  selectEmailToVerify,
  selectEmailVerifyErrorMessage,
} from 'redux/selectors/user';
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

export default connect(select, perform)(UserEmailVerify);
