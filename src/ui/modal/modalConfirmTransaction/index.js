import { connect } from 'react-redux';
import { doSendDraftTransaction } from 'lbry-redux';
import { doHideModal } from 'redux/actions/app';
import ModalConfirmTransaction from './view';

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  sendToAddress: (address, amount) => dispatch(doSendDraftTransaction(address, amount)),
});

export default connect(
  null,
  perform
)(ModalConfirmTransaction);
