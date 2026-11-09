//@ts-nocheck
import {connect} from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import ModalOpenExternalResource from './view';

const perform = dispatch: unknown => ({
  closeModal: () => dispatch(doHideModal()),
});

export default connect(
  null,
  perform
)(ModalOpenExternalResource);
