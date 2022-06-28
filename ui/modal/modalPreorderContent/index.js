import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import ModalPreorderContent from './view';

const perform = {
  doHideModal,
};

export default connect(null, perform)(ModalPreorderContent);
