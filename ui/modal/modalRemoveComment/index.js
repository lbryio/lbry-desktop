import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import ModalRemoveComment from './view';
import { doCommentAbandon } from 'redux/actions/comments';

const perform = {
  doHideModal,
  doCommentAbandon,
};

export default connect(null, perform)(ModalRemoveComment);
