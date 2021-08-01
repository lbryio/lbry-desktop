import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import ModalRemoveComment from './view';
import { doCommentAbandon } from 'redux/actions/comments';

const perform = (dispatch) => ({
  closeModal: () => dispatch(doHideModal()),
  deleteComment: (commentId, creatorChannelUrl) => dispatch(doCommentAbandon(commentId, creatorChannelUrl)),
});

export default connect(null, perform)(ModalRemoveComment);
