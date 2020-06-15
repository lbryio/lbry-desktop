import { connect } from 'react-redux';
import { selectUser, selectUserIsPending, selectEmailToVerify, selectEmailNewErrorMessage } from 'redux/selectors/user';
import { doUserSignIn, doClearEmailEntry } from 'redux/actions/user';
import UserSignIn from './view';

const select = state => ({
  user: selectUser(state),
  userFetchPending: selectUserIsPending(state),
  emailToVerify: selectEmailToVerify(state),
  errorMessage: selectEmailNewErrorMessage(state),
});

export default connect(select, {
  doUserSignIn,
  doClearEmailEntry,
})(UserSignIn);
