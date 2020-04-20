import { connect } from 'react-redux';
import {
  selectEmailNewErrorMessage,
  selectEmailToVerify,
  doUserCheckIfEmailExists,
  doClearEmailEntry,
  selectEmailDoesNotExist,
  selectEmailAlreadyExists,
  selectUser,
} from 'lbryinc';
import { doSetClientSetting } from 'redux/actions/settings';
import UserEmailReturning from './view';

const select = state => ({
  errorMessage: selectEmailNewErrorMessage(state),
  emailToVerify: selectEmailToVerify(state),
  emailDoesNotExist: selectEmailDoesNotExist(state),
  emailExists: selectEmailAlreadyExists(state),
  user: selectUser(state),
});

export default connect(select, {
  doUserCheckIfEmailExists,
  doClearEmailEntry,
  doSetClientSetting,
})(UserEmailReturning);
