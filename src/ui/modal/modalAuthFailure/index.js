import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import ModalAuthFailure from './view';

const select = () => ({});

const perform = dispatch => ({
  close: () => dispatch(doHideModal()),
});

export default connect(
  select,
  perform
)(ModalAuthFailure);
