import { connect } from 'react-redux';
import {
  selectTopLevelCommentsForUri,
  makeSelectTopLevelTotalPagesForUri,
  selectIsFetchingComments,
  selectIsFetchingCommentsById,
  selectIsFetchingReacts,
  makeSelectTotalCommentsCountForUri,
  selectOthersReacts,
  selectMyReacts,
  makeSelectCommentIdsForUri,
  selectSettingsByChannelId,
  selectPinnedCommentsForUri,
} from 'redux/selectors/comments';
import { doCommentReset, doCommentList, doCommentById, doCommentReactList } from 'redux/actions/comments';
import { doResolveUris } from 'redux/actions/claims';
import { makeSelectClaimForUri, makeSelectClaimIsMine, selectFetchingMyChannels } from 'redux/selectors/claims';
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
    activeChannelId: activeChannelClaim && activeChannelClaim.claim_id,
    allCommentIds: makeSelectCommentIdsForUri(props.uri)(state),
    claim: makeSelectClaimForUri(props.uri)(state),
    claimIsMine: makeSelectClaimIsMine(props.uri)(state),
    fetchingChannels: selectFetchingMyChannels(state),
    isFetchingComments: selectIsFetchingComments(state),
    isFetchingCommentsById: selectIsFetchingCommentsById(state),
    isFetchingReacts: selectIsFetchingReacts(state),
    myReactsByCommentId: selectMyReacts(state),
    othersReactsById: selectOthersReacts(state),
    pinnedComments: selectPinnedCommentsForUri(state, props.uri),
    resolvedComments,
    settingsByChannelId: selectSettingsByChannelId(state),
    topLevelComments,
    topLevelTotalPages: makeSelectTopLevelTotalPagesForUri(props.uri)(state),
    totalComments: makeSelectTotalCommentsCountForUri(props.uri)(state),
  };
};

const perform = (dispatch, ownProps) => ({
  doResolveUris: (uris) => dispatch(doResolveUris(uris, true)),
  fetchComment: (commentId) => dispatch(doCommentById(commentId)),
  fetchReacts: (commentIds) => dispatch(doCommentReactList(commentIds)),
  fetchTopLevelComments: (page, pageSize, sortBy) => dispatch(doCommentList(ownProps.uri, '', page, pageSize, sortBy)),
  resetComments: () => ownProps.claim && dispatch(doCommentReset(ownProps.claim.claimId)),
});

export default connect(select, perform)(CommentsList);
