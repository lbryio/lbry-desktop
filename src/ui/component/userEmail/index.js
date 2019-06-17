import { connect } from 'react-redux';
import { selectEmailToVerify, doUserResendVerificationEmail, doUserCheckEmailVerified, selectUser } from 'lbryinc';
import UserEmailVerify from './view';

const select = state => ({
  email: selectEmailToVerify(state),
  user: selectUser(state),
});

const perform = dispatch => ({
  resendVerificationEmail: email => dispatch(doUserResendVerificationEmail(email)),
  checkEmailVerified: () => dispatch(doUserCheckEmailVerified()),
});

export default connect(
  select,
  perform
)(UserEmailVerify);
