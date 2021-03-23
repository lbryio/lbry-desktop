import { connect } from 'react-redux';
import { makeSelectClaimForUri, selectMyChannelClaims, selectFetchingMyChannels } from 'lbry-redux';
import { selectIsPostingComment } from 'redux/selectors/comments';
import { doOpenModal, doSetActiveChannel } from 'redux/actions/app';
import { doCommentCreate } from 'redux/actions/comments';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { CommentCreate } from './view';

const select = (state, props) => ({
  commentingEnabled: IS_WEB ? Boolean(selectUserVerifiedEmail(state)) : true,
  claim: makeSelectClaimForUri(props.uri)(state),
  channels: selectMyChannelClaims(state),
  isFetchingChannels: selectFetchingMyChannels(state),
  isPostingComment: selectIsPostingComment(state),
  activeChannelClaim: selectActiveChannelClaim(state),
});

const perform = (dispatch, ownProps) => ({
  createComment: (comment, claimId, parentId) => dispatch(doCommentCreate(comment, claimId, parentId, ownProps.uri)),
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  setActiveChannel: claimId => dispatch(doSetActiveChannel(claimId)),
});

export default connect(select, perform)(CommentCreate);
