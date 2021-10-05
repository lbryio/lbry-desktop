import { connect } from 'react-redux';
import {
  selectEmailNewErrorMessage,
  selectEmailToVerify,
  selectEmailDoesNotExist,
  selectEmailAlreadyExists,
  selectUser,
  selectEmailNewIsPending,
} from 'redux/selectors/user';
import { doUserCheckIfEmailExists, doClearEmailEntry } from 'redux/actions/user';
import { doSetWalletSyncPreference } from 'redux/actions/settings';
import UserEmailReturning from './view';

const select = state => ({
  errorMessage: selectEmailNewErrorMessage(state),
  emailToVerify: selectEmailToVerify(state),
  emailDoesNotExist: selectEmailDoesNotExist(state),
  emailExists: selectEmailAlreadyExists(state),
  isPending: selectEmailNewIsPending(state),
  user: selectUser(state),
});

export default connect(select, {
  doUserCheckIfEmailExists,
  doClearEmailEntry,
  doSetWalletSyncPreference,
})(UserEmailReturning);
