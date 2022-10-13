import { connect } from 'react-redux';
import { doMembershipList } from 'redux/actions/memberships';
import {
  selectMembershipMineFetched,
  selectMyActiveMembershipsForCreatorId,
  selectMyValidMembershipsForCreatorId,
  selectMyPurchasedMembershipsForChannelClaimId,
  selectMyCanceledMembershipsForChannelClaimId,
  selectOdyseeMembershipTiers,
} from 'redux/selectors/memberships';
import { ODYSEE_CHANNEL } from 'constants/channels';

import OdyseeMembership from './view';

const select = (state) => ({
  mineFetched: selectMembershipMineFetched(state),
  validMemberships: selectMyValidMembershipsForCreatorId(state, ODYSEE_CHANNEL.ID),
  activeMemberships: selectMyActiveMembershipsForCreatorId(state, ODYSEE_CHANNEL.ID),
  purchasedMemberships: selectMyPurchasedMembershipsForChannelClaimId(state, ODYSEE_CHANNEL.ID),
  canceledMemberships: selectMyCanceledMembershipsForChannelClaimId(state, ODYSEE_CHANNEL.ID),
  membershipOptions: selectOdyseeMembershipTiers(state),
});

const perform = {
  doMembershipList,
};

export default connect(select, perform)(OdyseeMembership);
