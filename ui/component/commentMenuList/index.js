import { connect } from 'react-redux';
import { makeSelectChannelPermUrlForClaimUri, makeSelectClaimIsMine, makeSelectClaimForUri } from 'lbry-redux';
import {
  doCommentAbandon,
  doCommentPin,
  doCommentModBlock,
  doCommentModBlockAsAdmin,
  doCommentModBlockAsModerator,
  doCommentModAddDelegate,
} from 'redux/actions/comments';
import { doChannelMute } from 'redux/actions/blocked';
// import { doSetActiveChannel } from 'redux/actions/app';
import { doSetPlayingUri } from 'redux/actions/content';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectPlayingUri } from 'redux/selectors/content';
import { selectModerationDelegatorsById } from 'redux/selectors/comments';
import CommentMenuList from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  contentChannelPermanentUrl: makeSelectChannelPermUrlForClaimUri(props.uri)(state),
  activeChannelClaim: selectActiveChannelClaim(state),
  playingUri: selectPlayingUri(state),
  moderationDelegatorsById: selectModerationDelegatorsById(state),
});

const perform = (dispatch) => ({
  clearPlayingUri: () => dispatch(doSetPlayingUri({ uri: null })),
  deleteComment: (commentId, creatorChannelUrl) => dispatch(doCommentAbandon(commentId, creatorChannelUrl)),
  muteChannel: (channelUri) => dispatch(doChannelMute(channelUri)),
  pinComment: (commentId, claimId, remove) => dispatch(doCommentPin(commentId, claimId, remove)),
  //   setActiveChannel: channelId => dispatch(doSetActiveChannel(channelId)),
  commentModBlock: (commenterUri) => dispatch(doCommentModBlock(commenterUri)),
  commentModBlockAsAdmin: (commenterUri, blockerId) => dispatch(doCommentModBlockAsAdmin(commenterUri, blockerId)),
  commentModBlockAsModerator: (commenterUri, creatorId, blockerId) =>
    dispatch(doCommentModBlockAsModerator(commenterUri, creatorId, blockerId)),
  commentModAddDelegate: (modChanId, modChanName, creatorChannelClaim) =>
    dispatch(doCommentModAddDelegate(modChanId, modChanName, creatorChannelClaim, true)),
});

export default connect(select, perform)(CommentMenuList);
