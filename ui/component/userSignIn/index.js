import { connect } from 'react-redux';
import { selectUser, selectUserIsPending, selectEmailToVerify, selectPasswordExists, doUserSignIn } from 'lbryinc';
import UserSignIn from './view';

const select = state => ({
  user: selectUser(state),
  userFetchPending: selectUserIsPending(state),
  emailToVerify: selectEmailToVerify(state),
  passwordExists: selectPasswordExists(state),
});

export default connect(select, {
  doUserSignIn,
})(UserSignIn);
