import { connect } from 'react-redux';
import {
  selectTotalStakedAmountForChannelUri,
  makeSelectClaimForUri,
  selectThumbnailForUri,
  selectHasChannels,
  selectMyChannelClaims,
} from 'redux/selectors/claims';
import { doCommentUpdate, doCommentList } from 'redux/actions/comments';
import { makeSelectChannelIsMuted } from 'redux/selectors/blocked';
import { doToast } from 'redux/actions/notifications';
import { doSetPlayingUri } from 'redux/actions/content';
import {
  selectLinkedCommentAncestors,
  selectOthersReactsForComment,
  makeSelectTotalReplyPagesForParentId,
} from 'redux/selectors/comments';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectPlayingUri } from 'redux/selectors/content';
import Comment from './view';

const select = (state, props) => {
  const activeChannelClaim = selectActiveChannelClaim(state);
  const activeChannelId = activeChannelClaim && activeChannelClaim.claim_id;
  const reactionKey = activeChannelId ? `${props.commentId}:${activeChannelId}` : props.commentId;

  return {
    claim: makeSelectClaimForUri(props.uri)(state),
    thumbnail: props.authorUri && selectThumbnailForUri(state, props.authorUri),
    channelIsBlocked: props.authorUri && makeSelectChannelIsMuted(props.authorUri)(state),
    commentingEnabled: true,
    othersReacts: selectOthersReactsForComment(state, reactionKey),
    activeChannelClaim,
    hasChannels: selectHasChannels(state), //
    myChannels: selectMyChannelClaims(state),
    playingUri: selectPlayingUri(state),
    stakedLevel: selectTotalStakedAmountForChannelUri(state, props.authorUri),
    linkedCommentAncestors: selectLinkedCommentAncestors(state),
    totalReplyPages: makeSelectTotalReplyPagesForParentId(props.commentId)(state),
  };
};

const perform = (dispatch) => ({
  clearPlayingUri: () => dispatch(doSetPlayingUri({ uri: null })),
  updateComment: (commentId, comment) => dispatch(doCommentUpdate(commentId, comment)),
  fetchReplies: (uri, parentId, page, pageSize, sortBy) =>
    dispatch(doCommentList(uri, parentId, page, pageSize, sortBy)),
  doToast: (options) => dispatch(doToast(options)),
});

export default connect(select, perform)(Comment);
