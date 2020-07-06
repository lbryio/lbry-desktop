import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectGetSyncErrorMessage } from 'lbryinc';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doSetClientSetting } from 'redux/actions/settings';
import SyncToggle from './view';

const select = state => ({
  syncEnabled: makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state),
  verifiedEmail: selectUserVerifiedEmail(state),
  getSyncError: selectGetSyncErrorMessage(state),
  language: makeSelectClientSetting(SETTINGS.LANGUAGE)(state),
});

const perform = dispatch => ({
  setSyncEnabled: value => dispatch(doSetClientSetting(SETTINGS.ENABLE_SYNC, value)),
});

export default connect(select, perform)(SyncToggle);
