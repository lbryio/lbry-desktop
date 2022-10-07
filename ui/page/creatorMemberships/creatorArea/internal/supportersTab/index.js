import { connect } from 'react-redux';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectMySupportersList, selectMembershipTiersForChannelId } from 'redux/selectors/memberships';
import SupportersTab from './view';

const select = (state) => {
  const activeChannelClaim = selectActiveChannelClaim(state);

  return {
    channelMembershipTiers: activeChannelClaim && selectMembershipTiersForChannelId(state, activeChannelClaim.claim_id),
    supportersList: selectMySupportersList(state),
  };
};

export default connect(select)(SupportersTab);
