import { connect } from 'react-redux';

import { doCommentCreate, makeSelectClaimForUri, selectMyActiveChannelUri } from 'lbry-redux';
import CommentCreate from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  channelUri: selectMyActiveChannelUri(state),
});

const perform = dispatch => ({
  createComment: params => dispatch(doCommentCreate(params)),
});

export default connect(
  select,
  perform
)(CommentCreate);
