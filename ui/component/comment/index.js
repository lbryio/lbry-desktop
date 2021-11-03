import { connect } from 'react-redux';
import {
  makeSelectStakedLevelForChannelUri,
  makeSelectClaimForUri,
  makeSelectThumbnailForUri,
  selectMyChannelClaims,
} from 'redux/selectors/claims';
import {
  selectLinkedCommentAncestors,
  selectOthersReactsForComment,
  makeSelectTotalReplyPagesForParentId,
} from 'redux/selectors/comments';
import { doCommentUpdate, doCommentList } from 'redux/actions/comments';
import { doSetPlayingUri } from 'redux/actions/content';
import { doToast } from 'redux/actions/notifications';
import { makeSelectChannelIsMuted } from 'redux/selectors/blocked';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectPlayingUri } from 'redux/selectors/content';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import CommentView from './view';

const select = (state, props) => {
  const { channel_url: authorUri, comment_id: commentId } = props.comment;

  const activeChannelClaim = selectActiveChannelClaim(state);
  const activeChannelId = activeChannelClaim && activeChannelClaim.claim_id;
  const reactionKey = activeChannelId ? `${commentId}:${activeChannelId}` : commentId;

  return {
    channelIsBlocked: authorUri && makeSelectChannelIsMuted(authorUri)(state),
    claim: makeSelectClaimForUri(props.uri)(state),
    linkedCommentAncestors: selectLinkedCommentAncestors(state),
    myChannels: selectMyChannelClaims(state),
    othersReacts: selectOthersReactsForComment(state, reactionKey),
    playingUri: selectPlayingUri(state),
    stakedLevel: makeSelectStakedLevelForChannelUri(authorUri)(state),
    thumbnail: authorUri && makeSelectThumbnailForUri(authorUri)(state),
    totalReplyPages: makeSelectTotalReplyPagesForParentId(commentId)(state),
    userCanComment: selectUserVerifiedEmail(state),
  };
};

const perform = (dispatch, ownProps) => ({
  clearPlayingUri: () => dispatch(doSetPlayingUri({ uri: null })),
  updateComment: (editedComment) => dispatch(doCommentUpdate(ownProps.comment.comment_id, editedComment)),
  fetchReplies: (page, pageSize, sortBy) =>
    dispatch(doCommentList(ownProps.uri, ownProps.comment.comment_id, page, pageSize, sortBy)),
  doToast: (options) => dispatch(doToast(options)),
});

export default connect(select, perform)(CommentView);
