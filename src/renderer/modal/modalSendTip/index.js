import { connect } from 'react-redux';
import { doCloseModal } from 'redux/actions/app';
import ModalSendTip from './view';

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
});

export default connect(null, perform)(ModalSendTip);
