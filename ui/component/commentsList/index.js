import { connect } from 'react-redux';
import {
  selectClaimForUri,
  selectClaimIsMine,
  selectFetchingMyChannels,
  selectProtectedContentTagForUri,
} from 'redux/selectors/claims';
import {
  selectTopLevelCommentsForUri,
  makeSelectTopLevelTotalPagesForUri,
  selectIsFetchingComments,
  selectIsFetchingTopLevelComments,
  selectIsFetchingReacts,
  selectTotalCommentsCountForUri,
  selectOthersReacts,
  selectMyReacts,
  selectCommentIdsForUri,
  selectCommentsEnabledSettingForChannelId,
  selectPinnedCommentsForUri,
  selectCommentForCommentId,
  selectCommentAncestorsForId,
} from 'redux/selectors/comments';
import { doCommentReset, doCommentList, doCommentById, doCommentReactList } from 'redux/actions/comments';
import { doPopOutInlinePlayer } from 'redux/actions/content';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { getChannelIdFromClaim } from 'util/claim';
import {
  doFetchOdyseeMembershipForChannelIds,
  doFetchChannelMembershipsForChannelIds,
} from 'redux/actions/memberships';
import { selectUserHasValidMembershipForCreatorId } from 'redux/selectors/memberships';
import CommentsList from './view';

const select = (state, props) => {
  const { uri, threadCommentId, linkedCommentId } = props;

  const claim = selectClaimForUri(state, uri);
  const channelId = getChannelIdFromClaim(claim);

  const activeChannelClaim = selectActiveChannelClaim(state);
  const threadComment = selectCommentForCommentId(state, threadCommentId);
  const activeChannelId = activeChannelClaim && activeChannelClaim.claim_id;

  return {
    activeChannelId,
    allCommentIds: selectCommentIdsForUri(state, uri),
    channelId,
    chatCommentsRestrictedToChannelMembers: Boolean(selectProtectedContentTagForUri(state, uri)),
    claimId: claim && claim.claim_id,
    claimIsMine: selectClaimIsMine(state, claim),
    fetchingChannels: selectFetchingMyChannels(state),
    isAChannelMember: selectUserHasValidMembershipForCreatorId(state, channelId),
    isFetchingComments: selectIsFetchingComments(state),
    isFetchingReacts: selectIsFetchingReacts(state),
    isFetchingTopLevelComments: selectIsFetchingTopLevelComments(state),
    linkedCommentAncestors: selectCommentAncestorsForId(state, linkedCommentId),
    commentsEnabledSetting: selectCommentsEnabledSettingForChannelId(state, channelId),
    myReactsByCommentId: selectMyReacts(state),
    othersReactsById: selectOthersReacts(state),
    pinnedComments: selectPinnedCommentsForUri(state, uri),
    threadComment,
    threadCommentAncestors: selectCommentAncestorsForId(state, threadCommentId),
    topLevelComments: selectTopLevelCommentsForUri(state, uri),
    topLevelTotalPages: makeSelectTopLevelTotalPagesForUri(uri)(state),
    totalComments: selectTotalCommentsCountForUri(state, uri),
  };
};

const perform = {
  fetchTopLevelComments: doCommentList,
  fetchComment: doCommentById,
  fetchReacts: doCommentReactList,
  resetComments: doCommentReset,
  doFetchOdyseeMembershipForChannelIds,
  doFetchChannelMembershipsForChannelIds,
  doPopOutInlinePlayer,
};

export default connect(select, perform)(CommentsList);
