import { connect } from 'react-redux';
import { doHideModal, doOpenModal } from 'redux/actions/app';
import ModalReport from './view';

const perform = dispatch => () => ({
  closeModal: () => {
    dispatch(doHideModal());
  },
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(null, perform)(ModalReport);
