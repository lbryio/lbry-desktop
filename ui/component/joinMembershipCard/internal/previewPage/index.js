import { connect } from 'react-redux';
import { selectCanReceiveFiatTipsForUri } from 'redux/selectors/stripe';
import {
  selectMembershipTiersForChannelUri,
  selectMembershipTiersForCreatorId,
  selectUserHasValidMembershipForCreatorId,
} from 'redux/selectors/memberships';
import { doTipAccountCheckForUri } from 'redux/actions/stripe';
import { selectIsChannelMineForClaimId, selectClaimForUri } from 'redux/selectors/claims';
import { doOpenModal } from 'redux/actions/app';
import PreviewPage from './view';
import { getChannelFromClaim, getChannelTitleFromClaim, getChannelIdFromClaim } from 'util/claim';

const select = (state, props) => {
  const { uri } = props;
  const { claim_id: claimId } = selectClaimForUri(state, props.uri) || {};
  const claim = selectClaimForUri(state, props.uri);

  const channelTitle = getChannelTitleFromClaim(claim);
  const channelId = getChannelIdFromClaim(claim);

  const { canonical_url: channelUri } = getChannelFromClaim(claim) || {};

  return {
    canReceiveFiatTips: selectCanReceiveFiatTipsForUri(state, uri),
    creatorMemberships: selectMembershipTiersForChannelUri(state, uri),
    membershipTiers: selectMembershipTiersForCreatorId(state, claimId),
    channelIsMine: selectIsChannelMineForClaimId(state, claimId),
    channelTitle,
    channelUri,
    channelId: claimId,
    channelName: claim.name,
    userHasACreatorMembership: selectUserHasValidMembershipForCreatorId(state, channelId),
  };
};

const perform = (dispatch) => ({
  doTipAccountCheckForUri,
  doOpenModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(select, perform)(PreviewPage);
