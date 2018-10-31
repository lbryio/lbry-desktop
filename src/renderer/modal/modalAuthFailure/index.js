import { connect } from 'react-redux';
import { doHideNotification } from 'lbry-redux';
import ModalAuthFailure from './view';

const select = () => ({});

const perform = dispatch => ({
  close: () => dispatch(doHideNotification()),
});

export default connect(
  select,
  perform
)(ModalAuthFailure);
