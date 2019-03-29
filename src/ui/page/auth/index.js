import { connect } from 'react-redux';
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
  user: selectUser(state),
  isVerificationCandidate: selectUserIsVerificationCandidate(state),
});

export default connect(
  select,
  null
)(AuthPage);
