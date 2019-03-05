import { connect } from 'react-redux';
import { selectEmailNewIsPending, selectEmailNewErrorMessage, doUserEmailNew } from 'lbryinc';
import UserEmailNew from './view';

const select = state => ({
  isPending: selectEmailNewIsPending(state),
  errorMessage: selectEmailNewErrorMessage(state),
});

const perform = dispatch => ({
  addUserEmail: email => dispatch(doUserEmailNew(email)),
});

export default connect(
  select,
  perform
)(UserEmailNew);
