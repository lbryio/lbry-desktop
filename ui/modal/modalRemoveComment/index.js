import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import ModalRemoveComment from './view';
import { doCommentAbandon } from 'redux/actions/comments';
import { selectCommentForCommentId } from 'redux/selectors/comments';

const select = (state, props) => ({
  comment: selectCommentForCommentId(state, props.commentId),
});

const perform = {
  doHideModal,
  doCommentAbandon,
};

export default connect(select, perform)(ModalRemoveComment);
