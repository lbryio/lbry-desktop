import { connect } from 'react-redux';
import { doHideNotification } from 'lbry-redux';
import ModalOpenExternalLink from './view';

const perform = dispatch => ({
  closeModal: () => dispatch(doHideNotification()),
});

export default connect(null, perform)(ModalOpenExternalLink);
