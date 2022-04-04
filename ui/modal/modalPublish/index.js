import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import ModalPublishSuccess from './view';
import { doClearPublish } from 'redux/actions/publish';
import { push } from 'connected-react-router';

const perform = (dispatch) => ({
  closeModal: () => dispatch(doHideModal()),
  clearPublish: () => dispatch(doClearPublish()),
  navigate: (path) => dispatch(push(path)),
});

export default connect(null, perform)(ModalPublishSuccess);
