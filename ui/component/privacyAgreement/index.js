import { DOMAIN } from 'config';
import { connect } from 'react-redux';
import { doSetDaemonSetting } from 'redux/actions/settings';
import { doSignOut } from 'redux/actions/app';
import * as DAEMON_SETTINGS from 'constants/daemon_settings';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { doAuthenticate } from 'redux/actions/user';
import { version as appVersion } from 'package.json';

import PrivacyAgreement from './view';

const select = (state) => ({
  authenticated: selectUserVerifiedEmail(state),
});

const perform = (dispatch) => ({
  setShareDataInternal: (share) => dispatch(doSetDaemonSetting(DAEMON_SETTINGS.SHARE_USAGE_DATA, share)),
  signOut: () => dispatch(doSignOut()),
  authenticateIfSharingData: () =>
    dispatch(doAuthenticate(appVersion, undefined, undefined, true, undefined, undefined, DOMAIN)),
});

export default connect(select, perform)(PrivacyAgreement);
