import { connect } from 'react-redux';
import {
  makeSelectStakedLevelForChannelUri,
  makeSelectClaimForUri,
  makeSelectThumbnailForUri,
  selectMyChannelClaims,
} from 'lbry-redux';
import { doCommentUpdate, doCommentList } from 'redux/actions/comments';
import { makeSelectChannelIsMuted } from 'redux/selectors/blocked';
import { doToast } from 'redux/actions/notifications';
import { doSetPlayingUri } from 'redux/actions/content';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import {
  selectLinkedCommentAncestors,
  makeSelectOthersReactionsForComment,
  makeSelectTotalReplyPagesForParentId,
} from 'redux/selectors/comments';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectPlayingUri } from 'redux/selectors/content';
import Comment from './view';

const makeMapStateToProps = (originalState, originalProps) => {
  const activeChannelClaim = selectActiveChannelClaim(originalState);
  const activeChannelId = activeChannelClaim && activeChannelClaim.claim_id;
  const reactionKey = activeChannelId ? `${originalProps.commentId}:${activeChannelId}` : originalProps.commentId;
  const selectOthersReactionsForComment = makeSelectOthersReactionsForComment(reactionKey);

  const select = (state, props) => {
    const othersReacts = selectOthersReactionsForComment(state);

    return {
      claim: makeSelectClaimForUri(props.uri)(state),
      thumbnail: props.authorUri && makeSelectThumbnailForUri(props.authorUri)(state),
      channelIsBlocked: props.authorUri && makeSelectChannelIsMuted(props.authorUri)(state),
      commentingEnabled: IS_WEB ? Boolean(selectUserVerifiedEmail(state)) : true,
      othersReacts,
      activeChannelClaim,
      myChannels: selectMyChannelClaims(state),
      playingUri: selectPlayingUri(state),
      stakedLevel: makeSelectStakedLevelForChannelUri(props.authorUri)(state),
      linkedCommentAncestors: selectLinkedCommentAncestors(state),
      totalReplyPages: makeSelectTotalReplyPagesForParentId(props.commentId)(state),
    };
  };
  return select;
};

const perform = (dispatch) => ({
  clearPlayingUri: () => dispatch(doSetPlayingUri({ uri: null })),
  updateComment: (commentId, comment) => dispatch(doCommentUpdate(commentId, comment)),
  fetchReplies: (uri, parentId, page, pageSize, sortBy) =>
    dispatch(doCommentList(uri, parentId, page, pageSize, sortBy)),
  doToast: (options) => dispatch(doToast(options)),
});

export default connect(makeMapStateToProps, perform)(Comment);
