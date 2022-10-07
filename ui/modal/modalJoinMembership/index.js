import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import ModalJoinMembership from './view';

const perform = {
  doHideModal,
};

export default connect(null, perform)(ModalJoinMembership);
