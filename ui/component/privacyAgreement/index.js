import { connect } from 'react-redux';
import { doSetDaemonSetting } from 'redux/actions/settings';
import * as DAEMON_SETTINGS from 'constants/daemon_settings';

import PrivacyAgreement from './view';

const perform = (dispatch) => ({
  setShareDataInternal: (share) => dispatch(doSetDaemonSetting(DAEMON_SETTINGS.SHARE_USAGE_DATA, share)),
});

export default connect(null, perform)(PrivacyAgreement);
