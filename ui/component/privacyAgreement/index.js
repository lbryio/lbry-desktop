import { connect } from 'react-redux';
import { doSetDaemonSetting } from 'redux/actions/settings';
import { doSetWelcomeVersion, doToggle3PAnalytics } from 'redux/actions/app';
import PrivacyAgreement from './view';
import { DAEMON_SETTINGS } from 'lbry-redux';
import { WELCOME_VERSION } from 'config.js';

const perform = dispatch => ({
  setWelcomeVersion: version => dispatch(doSetWelcomeVersion(version || WELCOME_VERSION)),
  setShareDataInternal: share => dispatch(doSetDaemonSetting(DAEMON_SETTINGS.SHARE_USAGE_DATA, share)),
  setShareDataThirdParty: share => dispatch(doToggle3PAnalytics(share)),
});

export default connect(
  null,
  perform
)(PrivacyAgreement);
