import { connect } from 'react-redux';
import { doCommentCreate, makeSelectClaimForUri, selectMyChannelClaims } from 'lbry-redux';
import { doOpenModal } from 'redux/actions/app';
import { CommentCreate } from './view';
import { selectUserVerifiedEmail } from 'redux/selectors/user';

const select = (state, props) => ({
  commentingEnabled: IS_WEB ? Boolean(selectUserVerifiedEmail(state)) : true,
  claim: makeSelectClaimForUri(props.uri)(state),
  channels: selectMyChannelClaims(state),
});

const perform = dispatch => ({
  createComment: (comment, claimId, channel, parentId) =>
    dispatch(doCommentCreate(comment, claimId, channel, parentId)),
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(select, perform)(CommentCreate);
