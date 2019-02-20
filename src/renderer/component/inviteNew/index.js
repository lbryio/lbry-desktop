import { connect } from 'react-redux';
import {
  selectUserInvitesRemaining,
  selectUserInviteNewIsPending,
  selectUserInviteNewErrorMessage,
  selectUserInviteReferralLink,
  doUserInviteNew,
} from 'lbryinc';
import InviteNew from './view';

const select = state => ({
  errorMessage: selectUserInviteNewErrorMessage(state),
  invitesRemaining: selectUserInvitesRemaining(state),
  referralLink: selectUserInviteReferralLink(state),
  isPending: selectUserInviteNewIsPending(state),
});

const perform = dispatch => ({
  inviteNew: email => dispatch(doUserInviteNew(email)),
});

export default connect(
  select,
  perform
)(InviteNew);
