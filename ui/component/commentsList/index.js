import { connect } from 'react-redux';
import { makeSelectCommentsForUri, doCommentList } from 'lbry-redux';
import CommentsList from './view';

const select = (state, props) => ({
  comments: makeSelectCommentsForUri(props.uri)(state),
});

const perform = dispatch => ({
  fetchComments: uri => dispatch(doCommentList(uri)),
});

export default connect(
  select,
  perform
)(CommentsList);
