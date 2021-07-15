import { connect } from 'react-redux';
import Comment from './view';
import { makeSelectClaimIsMine, makeSelectClaimForUri } from 'lbry-redux';
import { doToast } from 'redux/actions/notifications';
import { makeSelectMyReactionsForComment, makeSelectOthersReactionsForComment } from 'redux/selectors/comments';
import { doCommentReact } from 'redux/actions/comments';
import { selectActiveChannelId } from 'redux/selectors/app';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  myReacts: makeSelectMyReactionsForComment(props.commentId)(state),
  othersReacts: makeSelectOthersReactionsForComment(props.commentId)(state),
  activeChannelId: selectActiveChannelId(state),
});

const perform = dispatch => ({
  react: (commentId, type) => dispatch(doCommentReact(commentId, type)),
  doToast: params => dispatch(doToast(params)),
});

export default connect(select, perform)(Comment);
