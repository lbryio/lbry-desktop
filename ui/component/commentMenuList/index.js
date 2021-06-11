import { connect } from 'react-redux';
import { makeSelectChannelPermUrlForClaimUri, makeSelectClaimIsMine, makeSelectClaimForUri } from 'lbry-redux';
import { doCommentAbandon, doCommentPin, doCommentList, doCommentModBlock } from 'redux/actions/comments';
import { doChannelMute } from 'redux/actions/blocked';
// import { doSetActiveChannel } from 'redux/actions/app';
import { doSetPlayingUri } from 'redux/actions/content';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectPlayingUri } from 'redux/selectors/content';
import CommentMenuList from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  contentChannelPermanentUrl: makeSelectChannelPermUrlForClaimUri(props.uri)(state),
  activeChannelClaim: selectActiveChannelClaim(state),
  playingUri: selectPlayingUri(state),
});

const perform = (dispatch) => ({
  clearPlayingUri: () => dispatch(doSetPlayingUri({ uri: null })),
  deleteComment: (commentId, creatorChannelUrl) => dispatch(doCommentAbandon(commentId, creatorChannelUrl)),
  muteChannel: (channelUri) => dispatch(doChannelMute(channelUri)),
  pinComment: (commentId, remove) => dispatch(doCommentPin(commentId, remove)),
  fetchComments: (uri) => dispatch(doCommentList(uri)),
  //   setActiveChannel: channelId => dispatch(doSetActiveChannel(channelId)),
  commentModBlock: (commentAuthor) => dispatch(doCommentModBlock(commentAuthor)),
});

export default connect(select, perform)(CommentMenuList);
