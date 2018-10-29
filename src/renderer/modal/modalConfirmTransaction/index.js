import { connect } from 'react-redux';
import { doHideNotification, doSendDraftTransaction } from 'lbry-redux';
import ModalConfirmTransaction from './view';

const perform = dispatch => ({
  closeModal: () => dispatch(doHideNotification()),
  sendToAddress: (address, amount) => dispatch(doSendDraftTransaction(address, amount)),
});

export default connect(null, perform)(ModalConfirmTransaction);
