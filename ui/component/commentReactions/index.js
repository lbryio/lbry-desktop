import { connect } from 'react-redux';
import Comment from './view';
import { makeSelectClaimIsMine, makeSelectClaimForUri } from 'lbry-redux';
import {
  makeSelectMyReactionsForComment,
  makeSelectOthersReactionsForComment,
  selectCommentChannel,
} from 'redux/selectors/comments';
import { doCommentReact } from 'redux/actions/comments';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  myReacts: makeSelectMyReactionsForComment(props.commentId)(state),
  othersReacts: makeSelectOthersReactionsForComment(props.commentId)(state),
  activeChannel: selectCommentChannel(state),
});

const perform = dispatch => ({
  react: (commentId, type) => dispatch(doCommentReact(commentId, type)),
});

export default connect(select, perform)(Comment);
