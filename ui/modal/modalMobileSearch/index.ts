//@ts-nocheck
import {connect} from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import ModalMobileSearch from './view';

const perform = dispatch: unknown => ({
  closeModal: () => dispatch(doHideModal()),
});

export default connect(null, perform)(ModalMobileSearch);
