import { connect } from 'react-redux';
import {
  doResolveUri,
  makeSelectClaimIsPending,
  makeSelectClaimForUri,
  makeSelectThumbnailForUri,
  makeSelectIsUriResolving,
  selectMyChannelClaims,
} from 'lbry-redux';
import { doCommentAbandon, doCommentUpdate } from 'redux/actions/comments';
import { doToggleBlockChannel } from 'redux/actions/blocked';
import { selectChannelIsBlocked } from 'redux/selectors/blocked';
import { doToast } from 'redux/actions/notifications';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectIsFetchingComments } from 'redux/selectors/comments';
import Comment from './view';

const select = (state, props) => ({
  pending: props.authorUri && makeSelectClaimIsPending(props.authorUri)(state),
  channel: props.authorUri && makeSelectClaimForUri(props.authorUri)(state),
  isResolvingUri: props.authorUri && makeSelectIsUriResolving(props.authorUri)(state),
  thumbnail: props.authorUri && makeSelectThumbnailForUri(props.authorUri)(state),
  channelIsBlocked: props.authorUri && selectChannelIsBlocked(props.authorUri)(state),
  commentingEnabled: IS_WEB ? Boolean(selectUserVerifiedEmail(state)) : true,
  isFetchingComments: selectIsFetchingComments(state),
  myChannels: selectMyChannelClaims(state),
});

const perform = dispatch => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
  updateComment: (commentId, comment) => dispatch(doCommentUpdate(commentId, comment)),
  deleteComment: commentId => dispatch(doCommentAbandon(commentId)),
  blockChannel: channelUri => dispatch(doToggleBlockChannel(channelUri)),
  doToast: options => dispatch(doToast(options)),
});

export default connect(select, perform)(Comment);
