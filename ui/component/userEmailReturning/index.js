import { connect } from 'react-redux';
import { selectEmailNewErrorMessage, selectEmailToVerify, doUserSignIn, doClearEmailError } from 'lbryinc';
import UserEmailReturning from './view';

const select = state => ({
  errorMessage: selectEmailNewErrorMessage(state),
  emailToVerify: selectEmailToVerify(state),
});

export default connect(select, {
  doUserSignIn,
  doClearEmailError,
})(UserEmailReturning);
