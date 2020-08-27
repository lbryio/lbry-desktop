import { connect } from 'react-redux';
import { SETTINGS } from 'lbry-redux';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doSetClientSetting, doSyncClientSettings } from 'redux/actions/settings';
import UserSignIn from './view';

const select = state => ({
  followingAcknowledged: makeSelectClientSetting(SETTINGS.FOLLOWING_ACKNOWLEDGED)(state),
  firstRunStarted: makeSelectClientSetting(SETTINGS.FIRST_RUN_STARTED)(state),
});

const perform = dispatch => ({
  syncSettings: () => dispatch(doSyncClientSettings()),
  setClientSetting: (setting, value) => dispatch(doSetClientSetting(setting, value)),
});

export default connect(select, perform)(UserSignIn);
