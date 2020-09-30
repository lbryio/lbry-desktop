import { connect } from 'react-redux';
import Comment from './view';
import {
  makeSelectMyReactionsForComment,
  makeSelectOthersReactionsForComment,
  selectPendingCommentReacts,
} from 'redux/selectors/comments';
import { doCommentReact } from 'redux/actions/comments';

const select = (state, props) => ({
  myReacts: makeSelectMyReactionsForComment(props.commentId)(state),
  othersReacts: makeSelectOthersReactionsForComment(props.commentId)(state),
  pendingCommentReacts: selectPendingCommentReacts(state),
});

const perform = dispatch => ({
  react: (commentId, type) => dispatch(doCommentReact(commentId, type)),
});

export default connect(select, perform)(Comment);
