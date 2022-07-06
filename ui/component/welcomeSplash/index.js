import { connect } from 'react-redux';
import { doSetDaemonSetting } from 'redux/actions/settings';
import { doSetWelcomeVersion } from 'redux/actions/app';
import * as DAEMON_SETTINGS from 'constants/daemon_settings';
import { WELCOME_VERSION } from 'config.js';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectDaemonSettings, selectDaemonStatus } from 'redux/selectors/settings';

import WelcomeSplash from './view';
import { selectDiskSpace } from 'redux/selectors/app';

const select = (state) => ({
  authenticated: selectUserVerifiedEmail(state),
  diskSpace: selectDiskSpace(state),
  daemonSettings: selectDaemonSettings(state),
  daemonStatus: selectDaemonStatus(state),
});

const perform = (dispatch) => ({
  setWelcomeVersion: (version) => dispatch(doSetWelcomeVersion(version || WELCOME_VERSION)),
  setShareDataInternal: (share) => dispatch(doSetDaemonSetting(DAEMON_SETTINGS.SHARE_USAGE_DATA, share)),
  setDaemonSetting: (key, value) => dispatch(doSetDaemonSetting(DAEMON_SETTINGS.BLOB_STORAGE_LIMIT_MB, value)),
});

export default connect(select, perform)(WelcomeSplash);
