import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import {
  selectGetSyncErrorMessage,
  selectHasSyncedWallet,
  selectGetSyncIsPending,
  selectHashChanged,
} from 'redux/selectors/sync';
import { doCheckSync, doGetSync } from 'redux/actions/sync';
import { selectClientSetting } from 'redux/selectors/settings';
import { doSetWalletSyncPreference } from 'redux/actions/settings';
import SyncToggle from './view';
import { doGetAndPopulatePreferences } from 'redux/actions/app';

const select = (state) => ({
  syncEnabled: selectClientSetting(state, SETTINGS.ENABLE_SYNC),
  hasSyncedWallet: selectHasSyncedWallet(state),
  hasSyncChanged: selectHashChanged(state),
  verifiedEmail: selectUserVerifiedEmail(state),
  getSyncError: selectGetSyncErrorMessage(state),
  getSyncPending: selectGetSyncIsPending(state),
});

const perform = (dispatch) => ({
  setSyncEnabled: (value) => dispatch(doSetWalletSyncPreference(value)),
  checkSync: () => dispatch(doCheckSync()),
  getSync: (pw, cb) => dispatch(doGetSync(pw, cb)),
  updatePreferences: () => dispatch(doGetAndPopulatePreferences()),
});

export default connect(select, perform)(SyncToggle);
