import { connect } from 'react-redux';
import { selectUser, selectUserIsPending } from 'lbryinc';
import UserSignIn from './view';

const select = state => ({
  user: selectUser(state),
  userFetchPending: selectUserIsPending(state),
});

export default connect(select)(UserSignIn);
