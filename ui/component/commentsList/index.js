import { connect } from 'react-redux';
import { doResolveUris } from 'redux/actions/claims';
import {
  makeSelectClaimForUri,
  selectClaimIsMineForUri,
  selectFetchingMyChannels,
  selectMyClaimIdsRaw,
} from 'redux/selectors/claims';
import {
  selectTopLevelCommentsForUri,
  makeSelectTopLevelTotalPagesForUri,
  selectIsFetchingComments,
  selectIsFetchingCommentsById,
  selectIsFetchingReacts,
  makeSelectTotalCommentsCountForUri,
  selectOthersReacts,
  selectMyReacts,
  selectCommentIdsForUri,
  selectSettingsByChannelId,
  selectPinnedCommentsForUri,
} from 'redux/selectors/comments';
import { doCommentReset, doCommentList, doCommentById, doCommentReactList } from 'redux/actions/comments';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import CommentsList from './view';

const select = (state, props) => {
  const activeChannelClaim = selectActiveChannelClaim(state);
  const topLevelComments = selectTopLevelCommentsForUri(state, props.uri);

  const resolvedComments =
    topLevelComments && topLevelComments.length > 0
      ? topLevelComments.filter(({ channel_url }) => makeSelectClaimForUri(channel_url)(state) !== undefined)
      : [];

  return {
    topLevelComments,
    resolvedComments,
    myChannelIds: selectMyClaimIdsRaw(state),
    allCommentIds: selectCommentIdsForUri(state, props.uri),
    pinnedComments: selectPinnedCommentsForUri(state, props.uri),
    topLevelTotalPages: makeSelectTopLevelTotalPagesForUri(props.uri)(state),
    totalComments: makeSelectTotalCommentsCountForUri(props.uri)(state),
    claim: makeSelectClaimForUri(props.uri)(state),
    claimIsMine: selectClaimIsMineForUri(state, props.uri),
    isFetchingComments: selectIsFetchingComments(state),
    isFetchingCommentsById: selectIsFetchingCommentsById(state),
    isFetchingReacts: selectIsFetchingReacts(state),
    fetchingChannels: selectFetchingMyChannels(state),
    settingsByChannelId: selectSettingsByChannelId(state),
    myReactsByCommentId: selectMyReacts(state),
    othersReactsById: selectOthersReacts(state),
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
