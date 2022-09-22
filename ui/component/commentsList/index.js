import { connect } from 'react-redux';
import {
  selectClaimForUri,
  selectClaimIsMine,
  selectFetchingMyChannels,
  selectClaimsByUri,
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
import { doFetchUserMemberships } from 'redux/actions/user';
import CommentsList from './view';

const select = (state, props) => {
  const { uri, threadCommentId, linkedCommentId } = props;

  const claim = selectClaimForUri(state, uri);
  const channelId = getChannelIdFromClaim(claim);
  const activeChannelClaim = selectActiveChannelClaim(state);
  const threadComment = selectCommentForCommentId(state, threadCommentId);

  return {
    topLevelComments: threadComment ? [threadComment] : selectTopLevelCommentsForUri(state, uri),
    threadComment,
    allCommentIds: selectCommentIdsForUri(state, uri),
    pinnedComments: selectPinnedCommentsForUri(state, uri),
    topLevelTotalPages: makeSelectTopLevelTotalPagesForUri(uri)(state),
    totalComments: selectTotalCommentsCountForUri(state, uri),
    claimId: claim && claim.claim_id,
    claimIsMine: selectClaimIsMine(state, claim),
    isFetchingComments: selectIsFetchingComments(state),
    isFetchingTopLevelComments: selectIsFetchingTopLevelComments(state),
    isFetchingReacts: selectIsFetchingReacts(state),
    fetchingChannels: selectFetchingMyChannels(state),
    commentsEnabledSetting: selectCommentsEnabledSettingForChannelId(state, channelId),
    myReactsByCommentId: selectMyReacts(state),
    othersReactsById: selectOthersReacts(state),
    activeChannelId: activeChannelClaim && activeChannelClaim.claim_id,
    claimsByUri: selectClaimsByUri(state),
    threadCommentAncestors: selectCommentAncestorsForId(state, threadCommentId),
    linkedCommentAncestors: selectCommentAncestorsForId(state, linkedCommentId),
  };
};

const perform = {
  fetchTopLevelComments: doCommentList,
  fetchComment: doCommentById,
  fetchReacts: doCommentReactList,
  resetComments: doCommentReset,
  doFetchUserMemberships,
  doPopOutInlinePlayer,
};

export default connect(select, perform)(CommentsList);
