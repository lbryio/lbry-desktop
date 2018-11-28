import { connect } from 'react-redux';
import { doAutoUpdateDeclined, doHideModal } from 'redux/actions/app';
import ModalAutoUpdateDownloaded from './view';

const perform = dispatch => ({
  closeModal: () => dispatch(doHideModal()),
  declineAutoUpdate: () => dispatch(doAutoUpdateDeclined()),
});

export default connect(
  null,
  perform
)(ModalAutoUpdateDownloaded);
