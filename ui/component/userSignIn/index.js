import { connect } from 'react-redux';
import { selectUser, selectUserIsPending, selectEmailToVerify, selectPasswordExists } from 'redux/selectors/user';
import { doUserSignIn } from 'redux/actions/user';
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
