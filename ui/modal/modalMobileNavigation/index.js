import { connect } from 'react-redux';
import { doHideModal, doSignOut } from 'redux/actions/app';
import ModalMobileNavigation from './view';

export default connect(
  null,
  {
    doHideModal,
    doSignOut,
  }
)(ModalMobileNavigation);
