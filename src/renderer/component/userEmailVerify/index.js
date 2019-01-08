import { connect } from 'react-redux';
import {
  selectEmailToVerify,
  doUserResendVerificationEmail,
  doUserFetch,
  selectUser,
} from 'lbryinc';
import { doNavigate } from 'redux/actions/navigation';
import UserEmailVerify from './view';

const select = state => ({
  email: selectEmailToVerify(state),
  user: selectUser(state),
});

const perform = dispatch => ({
  resendVerificationEmail: email => dispatch(doUserResendVerificationEmail(email)),
  doCheckEmailVerified: () => dispatch(doUserFetch(true)),
  navigate: path => dispatch(doNavigate(path)),
});

export default connect(
  select,
  perform
)(UserEmailVerify);
