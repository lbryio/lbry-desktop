import { connect } from 'react-redux';
import { selectMembershipOdyseePerks } from 'redux/selectors/memberships';
import { doMembershipAddTier, doMembershipList } from 'redux/actions/memberships';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import TiersTab from './view';

const select = (state, props) => ({
  membershipOdyseePerks: selectMembershipOdyseePerks(state),
  activeChannelClaim: selectActiveChannelClaim(state),
});

const perform = {
  doMembershipAddTier,
  doMembershipList,
};

export default connect(select, perform)(TiersTab);
