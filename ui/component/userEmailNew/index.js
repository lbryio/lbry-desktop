import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { selectEmailNewIsPending, selectEmailNewErrorMessage, doUserSignUp, doClearEmailError } from 'lbryinc';
import { DAEMON_SETTINGS } from 'lbry-redux';
import { doSetClientSetting, doSetDaemonSetting } from 'redux/actions/settings';
import { makeSelectClientSetting, selectDaemonSettings } from 'redux/selectors/settings';
import UserEmailNew from './view';

const select = state => ({
  isPending: selectEmailNewIsPending(state),
  errorMessage: selectEmailNewErrorMessage(state),
  syncEnabled: makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state),
  daemonSettings: selectDaemonSettings(state),
});

const perform = dispatch => ({
  setSync: value => dispatch(doSetClientSetting(SETTINGS.ENABLE_SYNC, value)),
  setShareDiagnosticData: shouldShareData =>
    dispatch(doSetDaemonSetting(DAEMON_SETTINGS.SHARE_USAGE_DATA, shouldShareData)),
  doSignUp: (email, password) => dispatch(doUserSignUp(email, password)),
  clearEmailError: () => dispatch(doClearEmailError()),
});

export default connect(select, perform)(UserEmailNew);
