import { connect } from 'react-redux';
import { doCommentCreate, makeSelectClaimForUri } from 'lbry-redux';
import { doOpenModal } from 'redux/actions/app';
import { CommentCreate } from './view';
import { selectUserVerifiedEmail } from 'lbryinc';

const select = (state, props) => ({
  commentingEnabled: IS_WEB ? Boolean(selectUserVerifiedEmail(state)) : true,
  claim: makeSelectClaimForUri(props.uri)(state),
});

const perform = dispatch => ({
  createComment: (comment, claimId, channel) => dispatch(doCommentCreate(comment, claimId, channel)),
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(
  select,
  perform
)(CommentCreate);
