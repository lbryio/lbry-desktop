import { connect } from 'react-redux';
import { doUserResendVerificationEmail, doUserCheckEmailVerified } from 'redux/actions/user';
import {
  selectEmailToVerify,
  selectEmailAlreadyExists,
  selectUser,
  selectResendingVerificationEmail,
} from 'redux/selectors/user';
import { doToast } from 'redux/actions/notifications';
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
