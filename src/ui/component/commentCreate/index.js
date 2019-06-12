import { connect } from 'react-redux';

import { doCommentCreate, makeSelectClaimForUri } from 'lbry-redux';
import { CommentCreate } from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
});

const perform = dispatch => ({
  createComment: (comment, claimId, channel) => dispatch(doCommentCreate(comment, claimId, channel)),
});

export default connect(
  select,
  perform
)(CommentCreate);
