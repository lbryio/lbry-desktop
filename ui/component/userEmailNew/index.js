import { connect } from 'react-redux';
import { doClearEmailEntry, doUserSignUp } from 'redux/actions/user';
import {
  selectEmailNewIsPending,
  selectEmailNewErrorMessage,
  selectEmailAlreadyExists,
  selectUser,
} from 'redux/selectors/user';
import { DAEMON_SETTINGS, SETTINGS } from 'lbry-redux';
import { doSetSyncPref, doSetDaemonSetting } from 'redux/actions/settings';
import { makeSelectClientSetting, selectDaemonSettings } from 'redux/selectors/settings';
import UserEmailNew from './view';

const select = state => ({
  isPending: selectEmailNewIsPending(state),
  errorMessage: selectEmailNewErrorMessage(state),
  syncEnabled: makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state),
  daemonSettings: selectDaemonSettings(state),
  emailExists: selectEmailAlreadyExists(state),
  user: selectUser(state),
});

const perform = dispatch => ({
  setSync: value => dispatch(doSetSyncPref(value)),
  setShareDiagnosticData: shouldShareData =>
    dispatch(doSetDaemonSetting(DAEMON_SETTINGS.SHARE_USAGE_DATA, shouldShareData)),
  doSignUp: (email, password) => dispatch(doUserSignUp(email, password)),
  clearEmailEntry: () => dispatch(doClearEmailEntry()),
});

export default connect(select, perform)(UserEmailNew);
