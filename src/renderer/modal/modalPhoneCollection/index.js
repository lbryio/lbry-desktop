import { connect } from 'react-redux';
import { doHideNotification } from 'lbry-redux';
import { selectPhoneToVerify, selectUser } from 'lbryinc';
import { doNavigate } from 'redux/actions/navigation';
import ModalPhoneCollection from './view';

const select = state => ({
  phone: selectPhoneToVerify(state),
  user: selectUser(state),
});

const perform = dispatch => () => ({
  closeModal: () => {
    dispatch(doHideNotification());
    dispatch(doNavigate('/rewards'));
  },
});

export default connect(
  select,
  perform
)(ModalPhoneCollection);
