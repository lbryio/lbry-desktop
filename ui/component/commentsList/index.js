import { connect } from 'react-redux';
import { makeSelectCommentsForUri, doCommentList, makeSelectClaimIsMine, selectMyChannelClaims } from 'lbry-redux';
import CommentsList from './view';

const select = (state, props) => ({
  myChannels: selectMyChannelClaims(state),
  comments: makeSelectCommentsForUri(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
});

const perform = dispatch => ({
  fetchComments: uri => dispatch(doCommentList(uri)),
});

export default connect(
  select,
  perform
)(CommentsList);
