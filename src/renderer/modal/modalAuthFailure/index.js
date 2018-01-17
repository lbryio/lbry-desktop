import { connect } from 'react-redux';
import { doCloseModal } from 'lbry-redux';
import ModalAuthFailure from './view';

// eslint-disable-next-line no-unused-vars
const select = state => ({});

// eslint-disable-next-line no-unused-vars
const perform = dispatch => ({
  close: () => dispatch(doCloseModal()),
});

export default connect(null, null)(ModalAuthFailure);
