import { connect } from 'react-redux';
import {
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
  selectOthersReacts,
  selectMyReacts,
  makeSelectCommentIdsForUri,
  selectSettingsByChannelId,
  makeSelectPinnedCommentsForUri,
} from 'redux/selectors/comments';
import { doCommentReset, doCommentList, doCommentById, doCommentReactList } from 'redux/actions/comments';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import CommentsList from './view';

const select = (state, props) => {
  const activeChannelClaim = selectActiveChannelClaim(state);
  return {
    myChannels: selectMyChannelClaims(state),
    allCommentIds: makeSelectCommentIdsForUri(props.uri)(state),
    pinnedComments: makeSelectPinnedCommentsForUri(props.uri)(state),
    topLevelComments: makeSelectTopLevelCommentsForUri(props.uri)(state),
    topLevelTotalPages: makeSelectTopLevelTotalPagesForUri(props.uri)(state),
    totalComments: makeSelectTotalCommentsCountForUri(props.uri)(state),
    claim: makeSelectClaimForUri(props.uri)(state),
    claimIsMine: makeSelectClaimIsMine(props.uri)(state),
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
});

export default connect(select, perform)(CommentsList);
