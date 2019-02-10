import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import { selectPhoneToVerify, selectUser } from 'lbryinc';
import { doNavigate } from 'redux/actions/navigation';
import ModalPhoneCollection from './view';

const select = state => ({
  phone: selectPhoneToVerify(state),
  user: selectUser(state),
});

const perform = dispatch => () => ({
  closeModal: () => {
    dispatch(doHideModal());
    dispatch(doNavigate('/rewards'));
  },
});

export default connect(
  select,
  perform
)(ModalPhoneCollection);
