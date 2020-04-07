import { connect } from 'react-redux';
import { doUserPasswordSet, selectPasswordSetSuccess, selectPasswordSetPending, selectPasswordSetError } from 'lbryinc';
import UserSignIn from './view';

const select = state => ({
  passwordSetSuccess: selectPasswordSetSuccess(state),
  passwordSetIsPending: selectPasswordSetPending(state),
  passwordSetError: selectPasswordSetError(state),
});

export default connect(select, {
  doUserPasswordSet,
})(UserSignIn);
