import { connect } from 'react-redux';
import {
  selectUserInvitesRemaining,
  selectUserInviteNewIsPending,
  selectUserInviteNewErrorMessage,
} from 'redux/selectors/user';
import { doUserInviteNew } from 'redux/actions/user';
import InviteNew from './view';

const select = state => ({
  errorMessage: selectUserInviteNewErrorMessage(state),
  invitesRemaining: selectUserInvitesRemaining(state),
  isPending: selectUserInviteNewIsPending(state),
});

const perform = dispatch => ({
  inviteNew: email => dispatch(doUserInviteNew(email)),
});

export default connect(select, perform)(InviteNew);
