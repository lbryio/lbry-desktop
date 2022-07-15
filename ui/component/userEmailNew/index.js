import { connect } from 'react-redux';
import { doClearEmailEntry, doUserSignUp } from 'redux/actions/user';
import {
  selectEmailNewIsPending,
  selectEmailNewErrorMessage,
  selectEmailAlreadyExists,
  selectUser,
} from 'redux/selectors/user';
import * as SETTINGS from 'constants/settings';
import * as DAEMON_SETTINGS from 'constants/daemon_settings';
import { doSetWalletSyncPreference, doSetDaemonSetting } from 'redux/actions/settings';
import { selectDaemonSettings, selectClientSetting } from 'redux/selectors/settings';
import UserEmailNew from './view';

const select = (state) => ({
  isPending: selectEmailNewIsPending(state),
  errorMessage: selectEmailNewErrorMessage(state),
  syncEnabled: selectClientSetting(state, SETTINGS.ENABLE_SYNC),
  daemonSettings: selectDaemonSettings(state),
  emailExists: selectEmailAlreadyExists(state),
  user: selectUser(state),
});

const perform = (dispatch) => ({
  setSync: (value) => dispatch(doSetWalletSyncPreference(value)),
  setShareDiagnosticData: (shouldShareData) =>
    dispatch(doSetDaemonSetting(DAEMON_SETTINGS.SHARE_USAGE_DATA, shouldShareData)),
  doSignUp: (email, password) => dispatch(doUserSignUp(email, password)),
  clearEmailEntry: () => dispatch(doClearEmailEntry()),
});

export default connect(select, perform)(UserEmailNew);
