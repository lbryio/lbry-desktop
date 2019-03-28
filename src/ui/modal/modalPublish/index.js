import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import ModalSendTip from './view';
import { doClearPublish } from 'redux/actions/publish';

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  clearPublish: () => dispatch(doClearPublish()),
});

export default connect(
  null,
  perform
)(ModalSendTip);
