import { connect } from 'react-redux';
import { doHideNotification } from 'lbry-redux';
import { doAuthNavigate } from 'redux/actions/navigation';
import ModalRewardApprovalRequired from './view';

const perform = dispatch => ({
  doAuth: () => {
    dispatch(doHideNotification());
    dispatch(doAuthNavigate());
  },
  closeModal: () => dispatch(doHideNotification()),
});

export default connect(null, perform)(ModalRewardApprovalRequired);
