import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import NagContinueFirstRun from './view';

const select = (state) => ({
  followingAcknowledged: makeSelectClientSetting(SETTINGS.FOLLOWING_ACKNOWLEDGED)(state),
  firstRunStarted: makeSelectClientSetting(SETTINGS.FIRST_RUN_STARTED)(state),
});

export default connect(select)(NagContinueFirstRun);
