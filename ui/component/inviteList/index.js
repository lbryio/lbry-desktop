import { connect } from 'react-redux';
import { selectReferralReward, selectUserInvitees, selectUserInviteStatusIsPending } from 'lbryinc';
import InviteList from './view';

const select = state => ({
  invitees: selectUserInvitees(state),
  isPending: selectUserInviteStatusIsPending(state),
  referralReward: selectReferralReward(state),
});

const perform = () => ({});

export default connect(
  select,
  perform
)(InviteList);
