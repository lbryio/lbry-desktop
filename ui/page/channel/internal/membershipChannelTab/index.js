import { connect } from 'react-redux';
import {
  selectMyPurchasedMembershipTierForCreatorUri,
  selectMembershipTiersForCreatorId,
} from 'redux/selectors/memberships';
import { selectChannelClaimIdForUri } from 'redux/selectors/claims';
import { doOpenCancelationModalForMembership } from 'redux/actions/memberships';
import { push } from 'connected-react-router';
import MembershipChannelTab from './view';

const select = (state, props) => {
  const { uri } = props;
  const channelClaimId = selectChannelClaimIdForUri(state, uri);
  const purchasedChannelMembership = selectMyPurchasedMembershipTierForCreatorUri(state, channelClaimId);
  const creatorMemberships = selectMembershipTiersForCreatorId(state, channelClaimId);
  const membershipIndex =
    (creatorMemberships &&
      creatorMemberships.findIndex(
        (membership) =>
          membership &&
          membership.Membership &&
          purchasedChannelMembership &&
          purchasedChannelMembership.Membership &&
          membership.Membership.id === purchasedChannelMembership.Membership.id
      )) + 1;

  return {
    purchasedChannelMembership,
    membershipIndex,
  };
};

const perform = (dispatch) => ({
  doOpenCancelationModalForMembership: (membership) => dispatch(doOpenCancelationModalForMembership(membership)),
  navigate: (path) => dispatch(push(path)),
});

export default connect(select, perform)(MembershipChannelTab);
