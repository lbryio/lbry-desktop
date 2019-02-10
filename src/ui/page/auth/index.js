import { selectPathAfterAuth } from 'lbry-redux';
import { connect } from 'react-redux';
import { doNavigate } from 'redux/actions/navigation';
import {
  selectAuthenticationIsPending,
  selectEmailToVerify,
  selectUserIsVerificationCandidate,
  selectUser,
  selectUserIsPending,
  selectIdentityVerifyIsPending,
} from 'lbryinc';
import AuthPage from './view';

const select = state => ({
  isPending:
    selectAuthenticationIsPending(state) ||
    selectUserIsPending(state) ||
    selectIdentityVerifyIsPending(state),
  email: selectEmailToVerify(state),
  pathAfterAuth: selectPathAfterAuth(state),
  user: selectUser(state),
  isVerificationCandidate: selectUserIsVerificationCandidate(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
});

export default connect(
  select,
  perform
)(AuthPage);
