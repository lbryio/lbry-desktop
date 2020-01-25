import { connect } from 'react-redux';
import {
  doResolveUri,
  makeSelectClaimIsPending,
  makeSelectClaimForUri,
  makeSelectThumbnailForUri,
  makeSelectIsUriResolving,
  selectChannelIsBlocked,
  doCommentUpdate, // doEditComment would be a more fitting name
  doCommentAbandon,
} from 'lbry-redux';
import Comment from './view';

const select = (state, props) => ({
  pending: props.authorUri && makeSelectClaimIsPending(props.authorUri)(state),
  channel: props.authorUri && makeSelectClaimForUri(props.authorUri)(state),
  isResolvingUri: props.authorUri && makeSelectIsUriResolving(props.authorUri)(state),
  thumbnail: props.authorUri && makeSelectThumbnailForUri(props.authorUri)(state),
  channelIsBlocked: props.authorUri && selectChannelIsBlocked(props.authorUri)(state),
});

const perform = dispatch => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
  updateComment: (commentId, comment) => dispatch(doCommentUpdate(commentId, comment)),
  deleteComment: commentId => dispatch(doCommentAbandon(commentId)),
});

export default connect(
  select,
  perform
)(Comment);
