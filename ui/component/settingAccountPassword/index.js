import { connect } from 'react-redux';
import {
  selectUser,
  selectPasswordSetSuccess,
  selectPasswordSetError,
  doUserPasswordSet,
  doClearPasswordEntry,
} from 'lbryinc';
import { doToast } from 'redux/actions/notifications';
import UserSignIn from './view';

const select = state => ({
  user: selectUser(state),
  passwordSetSuccess: selectPasswordSetSuccess(state),
  passwordSetError: selectPasswordSetError(state),
});

export default connect(select, {
  doUserPasswordSet,
  doToast,
  doClearPasswordEntry,
})(UserSignIn);
