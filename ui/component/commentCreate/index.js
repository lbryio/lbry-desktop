import { connect } from 'react-redux';
import { makeSelectClaimForUri, selectMyChannelClaims, selectFetchingMyChannels } from 'lbry-redux';
import { selectIsPostingComment, selectCommentChannel } from 'redux/selectors/comments';
import { doOpenModal } from 'redux/actions/app';
import { doCommentCreate, doSetCommentChannel } from 'redux/actions/comments';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { CommentCreate } from './view';

const select = (state, props) => ({
  commentingEnabled: IS_WEB ? Boolean(selectUserVerifiedEmail(state)) : true,
  claim: makeSelectClaimForUri(props.uri)(state),
  channels: selectMyChannelClaims(state),
  isFetchingChannels: selectFetchingMyChannels(state),
  isPostingComment: selectIsPostingComment(state),
  activeChannel: selectCommentChannel(state),
  authenticated: selectUserVerifiedEmail(state),
});

const perform = (dispatch, ownProps) => ({
  createComment: (comment, claimId, channel, parentId) =>
    dispatch(doCommentCreate(comment, claimId, channel, parentId, ownProps.uri)),
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  setCommentChannel: name => dispatch(doSetCommentChannel(name)),
});

export default connect(select, perform)(CommentCreate);
