import { connect } from 'react-redux';
import { doSendTip } from 'lbry-redux';
import { doHideModal } from 'redux/actions/app';
import ModalConfirmSendTip from './view';

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  sendSupport: (tipAmount, claimId, isSupport) => dispatch(doSendTip(tipAmount, claimId, isSupport)),
});

export default connect(null, perform)(ModalConfirmSendTip);
