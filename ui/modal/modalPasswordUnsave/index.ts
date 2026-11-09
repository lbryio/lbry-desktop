//@ts-nocheck
import {connect} from 'react-redux';
import ModalPasswordUnsave from './view';
import { doHideModal } from 'redux/actions/app';

// const select = () => ({});
//
const perform = dispatch: unknown => ({
  closeModal: () => dispatch(doHideModal()),
});

export default connect(
  null,
  perform
)(ModalPasswordUnsave);
