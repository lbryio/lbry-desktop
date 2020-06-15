import { connect } from 'react-redux';
import { selectReferralReward } from 'redux/selectors/rewards';
import { selectUserInvitees, selectUserInviteStatusIsPending } from 'redux/selectors/user';
import InviteList from './view';

const select = state => ({
  invitees: selectUserInvitees(state),
  isPending: selectUserInviteStatusIsPending(state),
  referralReward: selectReferralReward(state),
});

const perform = () => ({});

export default connect(select, perform)(InviteList);
