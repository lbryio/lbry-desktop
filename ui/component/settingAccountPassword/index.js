import { connect } from 'react-redux';
import { selectUser, selectPasswordSetSuccess, selectPasswordSetError } from 'redux/selectors/user';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doUserPasswordSet, doClearPasswordEntry } from 'redux/actions/user';
import { doToast } from 'redux/actions/notifications';
import UserSignIn from './view';
import * as SETTINGS from 'constants/settings';

const select = state => ({
  user: selectUser(state),
  passwordSetSuccess: selectPasswordSetSuccess(state),
  passwordSetError: selectPasswordSetError(state),
  language: makeSelectClientSetting(SETTINGS.LANGUAGE)(state),
});

export default connect(select, {
  doUserPasswordSet,
  doToast,
  doClearPasswordEntry,
})(UserSignIn);
