import { connect } from 'react-redux';
import { MAX_LIVESTREAM_COMMENTS } from 'constants/livestream';
import { doResolveUris } from 'redux/actions/claims';
import { selectClaimForUri, selectMyChannelClaims } from 'redux/selectors/claims';
import { doCommentList, doHyperChatList } from 'redux/actions/comments';
import {
  selectTopLevelCommentsForUri,
  selectHyperChatsForUri,
  selectPinnedCommentsForUri,
} from 'redux/selectors/comments';
import {
  doFetchOdyseeMembershipForChannelIds,
  doFetchChannelMembershipsForChannelIds,
  doListAllMyMembershipTiers,
} from 'redux/actions/memberships';
import { selectNoRestrictionOrUserIsMemberForContentClaimId } from 'redux/selectors/memberships';
import { getChannelIdFromClaim } from 'util/claim';

import ChatLayout from './view';

const select = (state, props) => {
  const { uri } = props;
  const claim = selectClaimForUri(state, uri);
  const claimId = claim && claim.claim_id;
  const channelId = getChannelIdFromClaim(claim);

  return {
    claimId,
    comments: selectTopLevelCommentsForUri(state, uri, MAX_LIVESTREAM_COMMENTS),
    pinnedComments: selectPinnedCommentsForUri(state, uri),
    superChats: selectHyperChatsForUri(state, uri),
    channelId,
    myChannelClaims: selectMyChannelClaims(state),
    contentUnlocked: claimId && selectNoRestrictionOrUserIsMemberForContentClaimId(state, claimId),
  };
};

const perform = {
  doCommentList,
  doHyperChatList,
  doResolveUris,
  doFetchOdyseeMembershipForChannelIds,
  doFetchChannelMembershipsForChannelIds,
  doListAllMyMembershipTiers,
};

export default connect(select, perform)(ChatLayout);
