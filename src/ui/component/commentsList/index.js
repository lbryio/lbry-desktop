import { connect } from 'react-redux';
import { makeSelectCommentsForUri, makeSelectClaimForUri, doCommentList } from 'lbry-redux';
import CommentsList from './view';

const select = (state, props) => ({
  comments: makeSelectCommentsForUri(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri)(state),
});

const perform = dispatch => ({
  fetchList: uri => dispatch(doCommentList(uri)),
});
export default connect(
  select,
  perform
)(CommentsList);
