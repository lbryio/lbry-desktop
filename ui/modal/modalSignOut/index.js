import { connect } from 'react-redux';
import { doSignOut, doHideModal } from 'redux/actions/app';
import ModalSignOut from './view';

export default connect(null, {
  doSignOut,
  doHideModal,
})(ModalSignOut);
