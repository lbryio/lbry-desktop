import { connect } from 'react-redux';
import {
  doResolveUris,
  makeSelectClaimForUri,
  makeSelectClaimIsMine,
  selectFetchingMyChannels,
  selectMyChannelClaims,
} from 'redux/selectors/claims';
import {
  makeSelectTopLevelCommentsForUri,
  makeSelectTopLevelTotalPagesForUri,
  selectIsFetchingComments,
  selectIsFetchingCommentsById,
  selectIsFetchingReacts,
  makeSelectTotalCommentsCountForUri,
  selectOthersReactsById,
  selectMyReactionsByCommentId,
  makeSelectCommentIdsForUri,
  selectSettingsByChannelId,
  makeSelectPinnedCommentsForUri,
} from 'redux/selectors/comments';
import { doCommentReset, doCommentList, doCommentById, doCommentReactList } from 'redux/actions/comments';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import CommentsList from './view';

const select = (state, props) => {
  const activeChannelClaim = selectActiveChannelClaim(state);
  const topLevelComments = makeSelectTopLevelCommentsForUri(props.uri)(state);

  const resolvedComments =
    topLevelComments && topLevelComments.length > 0
      ? topLevelComments.filter(({ channel_url }) => makeSelectClaimForUri(channel_url)(state) !== undefined)
      : [];

  return {
    topLevelComments,
    resolvedComments,
    myChannels: selectMyChannelClaims(state),
    allCommentIds: makeSelectCommentIdsForUri(props.uri)(state),
    pinnedComments: makeSelectPinnedCommentsForUri(props.uri)(state),
    topLevelTotalPages: makeSelectTopLevelTotalPagesForUri(props.uri)(state),
    totalComments: makeSelectTotalCommentsCountForUri(props.uri)(state),
    claim: makeSelectClaimForUri(props.uri)(state),
    claimIsMine: makeSelectClaimIsMine(props.uri)(state),
    isFetchingComments: selectIsFetchingComments(state),
    isFetchingCommentsById: selectIsFetchingCommentsById(state),
    isFetchingReacts: selectIsFetchingReacts(state),
    fetchingChannels: selectFetchingMyChannels(state),
    settingsByChannelId: selectSettingsByChannelId(state),
    myReactsByCommentId: selectMyReactionsByCommentId(state),
    othersReactsById: selectOthersReactsById(state),
    activeChannelId: activeChannelClaim && activeChannelClaim.claim_id,
  };
};

const perform = (dispatch) => ({
  fetchTopLevelComments: (uri, page, pageSize, sortBy) => dispatch(doCommentList(uri, '', page, pageSize, sortBy)),
  fetchComment: (commentId) => dispatch(doCommentById(commentId)),
  fetchReacts: (commentIds) => dispatch(doCommentReactList(commentIds)),
  resetComments: (claimId) => dispatch(doCommentReset(claimId)),
  doResolveUris: (uris) => dispatch(doResolveUris(uris, true)),
});

export default connect(select, perform)(CommentsList);
