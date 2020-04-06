import { connect } from 'react-redux';
import {
  selectEmailAlreadyExists,
  selectEmailToVerify,
  doUserResendVerificationEmail,
  doUserCheckEmailVerified,
  selectUser,
  selectResendingVerificationEmail,
} from 'lbryinc';
import { doToast } from 'lbry-redux';
import UserEmailVerify from './view';

const select = state => ({
  email: selectEmailToVerify(state),
  isReturningUser: selectEmailAlreadyExists(state),
  user: selectUser(state),
  resendingEmail: selectResendingVerificationEmail(state),
});

const perform = dispatch => ({
  resendVerificationEmail: email => dispatch(doUserResendVerificationEmail(email)),
  checkEmailVerified: () => dispatch(doUserCheckEmailVerified()),
  toast: message => dispatch(doToast({ message })),
});

export default connect(select, perform)(UserEmailVerify);
