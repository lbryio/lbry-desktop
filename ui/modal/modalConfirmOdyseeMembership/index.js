import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doToast } from 'redux/actions/notifications';
import ModalConfirmOdyseeMembership from './view';

const perform = (dispatch) => ({
  closeModal: () => dispatch(doHideModal()),
  doToast: (params) => dispatch(doToast(params)),
});

export default connect(null, perform)(ModalConfirmOdyseeMembership);
