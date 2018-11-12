import { connect } from 'react-redux';
import { doHideNotification } from 'lbry-redux';
import ModalAuthFailure from './view';

const select = state => ({});

const perform = dispatch => ({
  close: () => dispatch(doHideNotification()),
});

export default connect(null, null)(ModalAuthFailure);
