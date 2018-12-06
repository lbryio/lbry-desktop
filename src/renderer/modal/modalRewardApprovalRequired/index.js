import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { doAuthNavigate } from 'redux/actions/navigation';
import ModalRewardApprovalRequired from './view';

const perform = dispatch => ({
  doAuth: () => {
    dispatch(doHideModal());
    dispatch(doAuthNavigate());
  },
  closeModal: () => dispatch(doHideModal()),
});

export default connect(
  null,
  perform
)(ModalRewardApprovalRequired);
