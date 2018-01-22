import { connect } from 'react-redux';
import { doAuthNavigate, doCloseModal } from 'lbry-redux';
import ModalRewardApprovalRequired from './view';

const perform = dispatch => ({
  doAuth: () => {
    dispatch(doCloseModal());
    dispatch(doAuthNavigate());
  },
  closeModal: () => dispatch(doCloseModal()),
});

export default connect(null, perform)(ModalRewardApprovalRequired);
