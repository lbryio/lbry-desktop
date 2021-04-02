import { connect } from 'react-redux';
import { makeSelectStakedLevelForChannelUri, makeSelectClaimForUri, makeSelectThumbnailForUri, selectMyChannelClaims } from 'lbry-redux';
import { doCommentUpdate } from 'redux/actions/comments';
import { makeSelectChannelIsMuted } from 'redux/selectors/blocked';
import { doToast } from 'redux/actions/notifications';
import { doSetPlayingUri } from 'redux/actions/content';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { makeSelectOthersReactionsForComment } from 'redux/selectors/comments';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectPlayingUri } from 'redux/selectors/content';
import Comment from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  thumbnail: props.authorUri && makeSelectThumbnailForUri(props.authorUri)(state),
  channelIsBlocked: props.authorUri && makeSelectChannelIsMuted(props.authorUri)(state),
  commentingEnabled: IS_WEB ? Boolean(selectUserVerifiedEmail(state)) : true,
  othersReacts: makeSelectOthersReactionsForComment(props.commentId)(state),
  activeChannelClaim: selectActiveChannelClaim(state),
  myChannels: selectMyChannelClaims(state),
  playingUri: selectPlayingUri(state),
  stakedLevel: makeSelectStakedLevelForChannelUri(props.authorUri)(state),
});

const perform = (dispatch) => ({
  clearPlayingUri: () => dispatch(doSetPlayingUri({ uri: null })),
  updateComment: (commentId, comment) => dispatch(doCommentUpdate(commentId, comment)),
  doToast: (options) => dispatch(doToast(options)),
});

export default connect(select, perform)(Comment);
