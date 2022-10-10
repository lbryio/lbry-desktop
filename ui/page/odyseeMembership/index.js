import { connect } from 'react-redux';
import { doMembershipList } from 'redux/actions/memberships';
import {
  selectMembershipMineFetched,
  selectMyOdyseeMembershipsOnAutoRenew,
  selectMyValidMembershipsForCreatorId,
  selectMyPurchasedMembershipsForChannelClaimId,
  selectMyCanceledMembershipsForChannelClaimId,
  selectOdyseeMembershipTiers,
} from 'redux/selectors/memberships';
import { doGetCustomerStatus } from 'redux/actions/stripe';
import { ODYSEE_CHANNEL } from 'constants/channels';

import OdyseeMembership from './view';

const select = (state) => ({
  mineFetched: selectMembershipMineFetched(state),
  autoRenewMemberships: selectMyOdyseeMembershipsOnAutoRenew(state),
  activeMemberships: selectMyValidMembershipsForCreatorId(state, ODYSEE_CHANNEL.ID),
  purchasedMemberships: selectMyPurchasedMembershipsForChannelClaimId(state, ODYSEE_CHANNEL.ID),
  canceledMemberships: selectMyCanceledMembershipsForChannelClaimId(state, ODYSEE_CHANNEL.ID),
  membershipOptions: selectOdyseeMembershipTiers(state),
});

const perform = {
  doGetCustomerStatus,
  doMembershipList,
};

export default connect(select, perform)(OdyseeMembership);
