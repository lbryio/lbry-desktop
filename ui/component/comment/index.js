import { connect } from 'react-redux';
import { makeSelectThumbnailForUri, selectMyChannelClaims, makeSelectChannelPermUrlForClaimUri } from 'lbry-redux';
import { doCommentAbandon, doCommentUpdate, doCommentPin, doCommentList } from 'redux/actions/comments';
import { doToggleBlockChannel } from 'redux/actions/blocked';
import { selectChannelIsBlocked } from 'redux/selectors/blocked';
import { doToast } from 'redux/actions/notifications';
import { doSetPlayingUri } from 'redux/actions/content';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectIsFetchingComments, makeSelectOthersReactionsForComment } from 'redux/selectors/comments';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import Comment from './view';

const select = (state, props) => ({
  thumbnail: props.authorUri && makeSelectThumbnailForUri(props.authorUri)(state),
  channelIsBlocked: props.authorUri && selectChannelIsBlocked(props.authorUri)(state),
  commentingEnabled: IS_WEB ? Boolean(selectUserVerifiedEmail(state)) : true,
  isFetchingComments: selectIsFetchingComments(state),
  myChannels: selectMyChannelClaims(state),
  othersReacts: makeSelectOthersReactionsForComment(props.commentId)(state),
  contentChannelPermanentUrl: makeSelectChannelPermUrlForClaimUri(props.uri)(state),
  activeChannelClaim: selectActiveChannelClaim(state),
});

const perform = dispatch => ({
  closeInlinePlayer: () => dispatch(doSetPlayingUri({ uri: null })),
  updateComment: (commentId, comment) => dispatch(doCommentUpdate(commentId, comment)),
  deleteComment: commentId => dispatch(doCommentAbandon(commentId)),
  blockChannel: channelUri => dispatch(doToggleBlockChannel(channelUri)),
  doToast: options => dispatch(doToast(options)),
  pinComment: (commentId, remove) => dispatch(doCommentPin(commentId, remove)),
  fetchComments: uri => dispatch(doCommentList(uri)),
});

export default connect(select, perform)(Comment);
