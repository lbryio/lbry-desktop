import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import {
  doResolveUri,
  makeSelectClaimIsPending,
  makeSelectClaimForUri,
  makeSelectThumbnailForUri,
  makeSelectIsUriResolving,
  selectMyChannelClaims,
  // makeSelectMyChannelPermUrlForName,
  //   makeSelectChannelPermUrlForClaimUri,
} from 'lbry-redux';
import { doCommentAbandon, doCommentUpdate, doCommentPin, doCommentList } from 'redux/actions/comments';
import { doToggleBlockChannel } from 'redux/actions/blocked';
import { selectChannelIsBlocked } from 'redux/selectors/blocked';
import { doToast } from 'redux/actions/notifications';
import { doSetPlayingUri } from 'redux/actions/content';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import {
  selectIsFetchingComments,
  makeSelectOthersReactionsForComment,
  selectCommentChannel,
} from 'redux/selectors/comments';
import Comment from './view';

export const makeSelectMyChannelPermUrlForName = name =>
  createSelector(selectMyChannelClaims, claims => {
    const matchingClaim = claims && claims.find(claim => claim.name === name);
    return matchingClaim ? matchingClaim.permanent_url : null;
  });

export const makeSelectChannelPermUrlForClaimUri = (uri, includePrefix = false) =>
  createSelector(makeSelectClaimForUri(uri), claim => {
    if (claim && claim.value_type === 'channel') {
      return claim.permanent_url;
    }
    if (!claim || !claim.signing_channel || !claim.is_channel_signature_valid) {
      return null;
    }
    return claim.signing_channel.permanent_url;
  });

const select = (state, props) => {
  const channel = selectCommentChannel(state);

  return {
    activeChannel: channel,
    pending: props.authorUri && makeSelectClaimIsPending(props.authorUri)(state),
    channel: props.authorUri && makeSelectClaimForUri(props.authorUri)(state),
    isResolvingUri: props.authorUri && makeSelectIsUriResolving(props.authorUri)(state),
    thumbnail: props.authorUri && makeSelectThumbnailForUri(props.authorUri)(state),
    channelIsBlocked: props.authorUri && selectChannelIsBlocked(props.authorUri)(state),
    commentingEnabled: IS_WEB ? Boolean(selectUserVerifiedEmail(state)) : true,
    isFetchingComments: selectIsFetchingComments(state),
    myChannels: selectMyChannelClaims(state),
    othersReacts: makeSelectOthersReactionsForComment(props.commentId)(state),
    commentIdentityChannel: makeSelectMyChannelPermUrlForName(channel)(state),
    contentChannel: makeSelectChannelPermUrlForClaimUri(props.uri)(state),
  };
};

const perform = dispatch => ({
  closeInlinePlayer: () => dispatch(doSetPlayingUri({ uri: null })),
  resolveUri: uri => dispatch(doResolveUri(uri)),
  updateComment: (commentId, comment) => dispatch(doCommentUpdate(commentId, comment)),
  deleteComment: commentId => dispatch(doCommentAbandon(commentId)),
  blockChannel: channelUri => dispatch(doToggleBlockChannel(channelUri)),
  doToast: options => dispatch(doToast(options)),
  pinComment: (commentId, remove) => dispatch(doCommentPin(commentId, remove)),
  fetchComments: uri => dispatch(doCommentList(uri)),
});

export default connect(select, perform)(Comment);
