import { connect } from 'react-redux';
import { doClearEmailEntry, doUserFetch } from 'redux/actions/user';
import { doToast } from 'redux/actions/notifications';
import UserSignIn from './view';

const select = state => ({
  // passwordSetSuccess: selectPasswordSetSuccess(state),
  // passwordSetIsPending: selectPasswordSetIsPending(state),
  // passwordSetError: selectPasswordSetError(state),
});

export default connect(select, {
  doToast,
  doClearEmailEntry,
  doUserFetch,
})(UserSignIn);
