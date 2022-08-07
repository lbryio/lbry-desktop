import { connect } from 'react-redux';
// new sync stuff
import * as SETTINGS from 'constants/settings';
import * as DAEMON_SETTINGS from 'constants/daemon_settings';
import { doSetWalletSyncPreference, doSetDaemonSetting } from 'redux/actions/settings';
import { selectDaemonSettings, makeSelectClientSetting } from 'redux/selectors/settings';
import UserEmailNew from './view';

const select = (state) => ({
  syncEnabled: makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state),
  daemonSettings: selectDaemonSettings(state),
});

const perform = (dispatch) => ({
  setSync: (value) => dispatch(doSetWalletSyncPreference(value)),
  setShareDiagnosticData: (shouldShareData) =>
    dispatch(doSetDaemonSetting(DAEMON_SETTINGS.SHARE_USAGE_DATA, shouldShareData)),
});

export default connect(select, perform)(UserEmailNew);
