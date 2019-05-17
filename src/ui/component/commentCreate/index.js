import { connect } from 'react-redux';

import { makeSelectClaimForUri, selectMyChannelClaims, doCommentCreate, makeSelectCommentsForUri } from 'lbry-redux';

import CommentCreate from './view';

const select = (state, props) => ({
  channels: selectMyChannelClaims(state),
  comments: makeSelectCommentsForUri(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri)(state),
});

const perform = dispatch => ({
  createComment: params => dispatch(doCommentCreate(params)),
});

export default connect(
  select,
  perform
)(CommentCreate);
