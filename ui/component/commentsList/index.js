import { connect } from 'react-redux';
import { makeSelectClaimIsMine, selectFetchingMyChannels, selectMyChannelClaims } from 'lbry-redux';
import {
  makeSelectTopLevelCommentsForUri,
  makeSelectTopLevelTotalPagesForUri,
  selectIsFetchingComments,
  selectIsFetchingReacts,
  makeSelectTotalCommentsCountForUri,
  selectOthersReactsById,
  makeSelectCommentsDisabledForUri,
  selectMyReactionsByCommentId,
  makeSelectCommentIdsForUri,
} from 'redux/selectors/comments';
import { doCommentReset, doCommentList, doCommentById, doCommentReactList } from 'redux/actions/comments';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import CommentsList from './view';

const select = (state, props) => {
  const activeChannelClaim = selectActiveChannelClaim(state);
  return {
    myChannels: selectMyChannelClaims(state),
    allCommentIds: makeSelectCommentIdsForUri(props.uri)(state),
    topLevelComments: makeSelectTopLevelCommentsForUri(props.uri)(state),
    topLevelTotalPages: makeSelectTopLevelTotalPagesForUri(props.uri)(state),
    totalComments: makeSelectTotalCommentsCountForUri(props.uri)(state),
    claimIsMine: makeSelectClaimIsMine(props.uri)(state),
    isFetchingComments: selectIsFetchingComments(state),
    isFetchingReacts: selectIsFetchingReacts(state),
    commentingEnabled: IS_WEB ? Boolean(selectUserVerifiedEmail(state)) : true,
    commentsDisabledBySettings: makeSelectCommentsDisabledForUri(props.uri)(state),
    fetchingChannels: selectFetchingMyChannels(state),
    myReactsByCommentId: selectMyReactionsByCommentId(state),
    othersReactsById: selectOthersReactsById(state),
    activeChannelId: activeChannelClaim && activeChannelClaim.claim_id,
  };
};

const perform = (dispatch) => ({
  fetchTopLevelComments: (uri, page, pageSize, sortBy) => dispatch(doCommentList(uri, '', page, pageSize, sortBy)),
  fetchComment: (commentId) => dispatch(doCommentById(commentId)),
  fetchReacts: (commentIds) => dispatch(doCommentReactList(commentIds)),
  resetComments: (uri) => dispatch(doCommentReset(uri)),
});

export default connect(select, perform)(CommentsList);
