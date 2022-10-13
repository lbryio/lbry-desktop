import { connect } from 'react-redux';

import {
  selectMembershipTiersForChannelUri,
  selectProtectedContentMembershipsForContentClaimId,
  selectMembersOnlyChatMembershipIdsForCreatorId,
  selectCheapestPlanForRestrictedIds,
  selectNoRestrictionOrUserIsMemberForContentClaimId,
} from 'redux/selectors/memberships';
import { selectChannelNameForUri, selectChannelClaimIdForUri, selectClaimForUri } from 'redux/selectors/claims';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';
import {
  selectLivestreamChatMembersOnlyForChannelId,
  selectMembersOnlyCommentsForChannelId,
} from 'redux/selectors/comments';

import { doMembershipList, doMembershipBuy } from 'redux/actions/memberships';
import { doToast } from 'redux/actions/notifications';

import { getChannelIdFromClaim, isStreamPlaceholderClaim } from 'util/claim';

import PreviewPage from './view';

const select = (state, props) => {
  const { uri, fileUri } = props;

  const claim = selectClaimForUri(state, fileUri);
  const fileClaimId = claim && claim.claim_id;
  const channelId = getChannelIdFromClaim(claim);
  const isLivestream = isStreamPlaceholderClaim(claim);

  const isLiveMembersOnly = channelId && selectLivestreamChatMembersOnlyForChannelId(state, channelId);
  const areCommentsMembersOnly = channelId && selectMembersOnlyCommentsForChannelId(state, channelId);

  // -- If content is restricted, get the cheapest plan for the content instead
  const contentUnlocked = fileClaimId && selectNoRestrictionOrUserIsMemberForContentClaimId(state, fileClaimId);
  const membersOnly = contentUnlocked && (isLivestream ? isLiveMembersOnly : areCommentsMembersOnly);

  const unlockableTierIds = membersOnly
    ? channelId && selectMembersOnlyChatMembershipIdsForCreatorId(state, channelId)
    : fileClaimId && selectProtectedContentMembershipsForContentClaimId(state, fileClaimId);

  return {
    activeChannelClaim: selectActiveChannelClaim(state),
    creatorMemberships: selectMembershipTiersForChannelUri(state, uri),
    channelName: selectChannelNameForUri(state, uri),
    channelClaimId: selectChannelClaimIdForUri(state, uri),
    incognito: selectIncognito(state),
    unlockableTierIds,
    cheapestMembership: unlockableTierIds && selectCheapestPlanForRestrictedIds(state, unlockableTierIds),
    membersOnly,
    isLivestream,
  };
};

const perform = {
  doMembershipList,
  doMembershipBuy,
  doToast,
};

export default connect(select, perform)(PreviewPage);
