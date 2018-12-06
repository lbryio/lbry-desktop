import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import ModalSendTip from './view';
import { doClearPublish } from 'redux/actions/publish';
import { doNavigate } from 'redux/actions/navigation';

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  clearPublish: () => dispatch(doClearPublish()),
  navigate: (path, params) => dispatch(doNavigate(path, params)),
});

export default connect(
  null,
  perform
)(ModalSendTip);
