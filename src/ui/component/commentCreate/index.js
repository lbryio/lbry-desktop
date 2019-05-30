import { connect } from 'react-redux';

import { doCommentCreate, makeSelectClaimForUri, selectMyActiveChannelUri } from 'lbry-redux';
import { selectCommentsInfoAck, doAckComments } from 'redux/selectors/app';
import CommentCreate from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  channelUri: selectMyActiveChannelUri(state),
  acksComments: selectCommentsInfoAck(state),
});

const perform = dispatch => ({
  createComment: params => dispatch(doCommentCreate(params)),
  ackComments: () => dispatch(doAckComments()),
});

export default connect(
  select,
  perform
)(CommentCreate);
