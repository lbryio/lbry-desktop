//@ts-nocheck
import {connect} from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import ModalTransactionFailed from './view';

const select = () => ({});

const perform = (dispatch: unknown) => ({
  closeModal: () => dispatch(doHideModal()),
});

export default connect(
  select,
  perform
)(ModalTransactionFailed);
