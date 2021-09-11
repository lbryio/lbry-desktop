import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';

import ModalConfirm from './view';

const perform = (dispatch) => ({
  doHideModal: () => dispatch(doHideModal()),
});

export default connect(null, perform)(ModalConfirm);
