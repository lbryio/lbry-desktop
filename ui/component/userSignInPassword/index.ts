//@ts-nocheck
import {connect} from 'react-redux';
import {
  selectUser,
  selectUserIsPending,
  selectEmailToVerify,
  selectEmailNewErrorMessage,
  selectEmailNewIsPending,
} from 'redux/selectors/user';
import { doUserSignIn, doClearEmailEntry } from 'redux/actions/user';
import UserSignIn from './view';

const select = state: unknown => ({
  user: selectUser(state),
  userFetchPending: selectUserIsPending(state),
  emailToVerify: selectEmailToVerify(state),
  errorMessage: selectEmailNewErrorMessage(state),
  isPending: selectEmailNewIsPending(state),
});

export default connect(select, {
  doUserSignIn,
  doClearEmailEntry,
})(UserSignIn);
