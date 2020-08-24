import { connect } from 'react-redux';
import {
  doResolveUri,
  makeSelectClaimIsPending,
  makeSelectClaimForUri,
  makeSelectThumbnailForUri,
  makeSelectIsUriResolving,
} from 'lbry-redux';
import { doCommentAbandon, doCommentUpdate } from 'redux/actions/comments';
import { doToggleBlockChannel } from 'redux/actions/blocked';
import { selectChannelIsBlocked } from 'redux/selectors/blocked';
import Comment from './view';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectIsFetchingComments } from 'redux/selectors/comments';

const select = (state, props) => ({
  pending: props.authorUri && makeSelectClaimIsPending(props.authorUri)(state),
  channel: props.authorUri && makeSelectClaimForUri(props.authorUri)(state),
  isResolvingUri: props.authorUri && makeSelectIsUriResolving(props.authorUri)(state),
  thumbnail: props.authorUri && makeSelectThumbnailForUri(props.authorUri)(state),
  channelIsBlocked: props.authorUri && selectChannelIsBlocked(props.authorUri)(state),
  commentingEnabled: IS_WEB ? Boolean(selectUserVerifiedEmail(state)) : true,
  isFetchingComments: selectIsFetchingComments(state),
});

const perform = dispatch => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
  updateComment: (commentId, comment) => dispatch(doCommentUpdate(commentId, comment)),
  deleteComment: commentId => dispatch(doCommentAbandon(commentId)),
  blockChannel: channelUri => dispatch(doToggleBlockChannel(channelUri)),
});

export default connect(select, perform)(Comment);
