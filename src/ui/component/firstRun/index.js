import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { selectUser } from 'lbryinc';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doSetClientSetting } from 'redux/actions/settings';
import FirstRun from './view';

const select = state => ({
  emailCollectionAcknowledged: makeSelectClientSetting(SETTINGS.EMAIL_COLLECTION_ACKNOWLEDGED)(state),
  welcomeAcknowledged: makeSelectClientSetting(SETTINGS.NEW_USER_ACKNOWLEDGED)(state),
  firstRunComplete: makeSelectClientSetting(SETTINGS.FIRST_RUN_COMPLETED)(state),
  user: selectUser(state),
});

const perform = dispatch => ({
  acknowledgeWelcome: () => {
    dispatch(doSetClientSetting(SETTINGS.NEW_USER_ACKNOWLEDGED, true));
  },
  completeFirstRun: () => {
    dispatch(doSetClientSetting(SETTINGS.FIRST_RUN_COMPLETED, true));
  },
});

export default connect(
  select,
  perform
)(FirstRun);
