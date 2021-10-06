import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { selectPhoneToVerify, selectUser } from 'redux/selectors/user';
import ModalPhoneCollection from './view';

const select = state => ({
  phone: selectPhoneToVerify(state),
  user: selectUser(state),
});

const perform = dispatch => () => ({
  closeModal: () => dispatch(doHideModal()),
});

export default connect(select, perform)(ModalPhoneCollection);
