import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { selectClientSetting } from 'redux/selectors/settings';
import NagContinueFirstRun from './view';

const select = (state) => ({
  followingAcknowledged: selectClientSetting(state, SETTINGS.FOLLOWING_ACKNOWLEDGED),
  firstRunStarted: selectClientSetting(state, SETTINGS.FIRST_RUN_STARTED),
});

export default connect(select)(NagContinueFirstRun);
