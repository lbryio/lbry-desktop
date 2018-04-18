import { connect } from 'react-redux';
import { doCloseModal } from 'lbry-redux';
import { doAuthNavigate } from 'redux/actions/navigation';
import ModalRewardApprovalRequired from './view';

const perform = dispatch => ({
  doAuth: () => {
    dispatch(doCloseModal());
    dispatch(doAuthNavigate());
  },
  closeModal: () => dispatch(doCloseModal()),
});

export default connect(null, perform)(ModalRewardApprovalRequired);
