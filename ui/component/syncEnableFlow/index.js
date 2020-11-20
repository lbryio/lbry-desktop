import { SETTINGS } from 'lbry-redux';
import { connect } from 'react-redux';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import {
  selectGetSyncErrorMessage,
  selectHasSyncedWallet,
  selectGetSyncIsPending,
  selectHashChanged,
} from 'redux/selectors/sync';
import { doCheckSync, doGetSync } from 'redux/actions/sync';
import { makeSelectClientSetting, selectLanguage } from 'redux/selectors/settings';
import { doSetWalletSyncPreference } from 'redux/actions/settings';
import SyncToggle from './view';
import { doGetAndPopulatePreferences } from 'redux/actions/app';

const select = state => ({
  syncEnabled: makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state),
  hasSyncedWallet: selectHasSyncedWallet(state),
  hasSyncChanged: selectHashChanged(state),
  verifiedEmail: selectUserVerifiedEmail(state),
  getSyncError: selectGetSyncErrorMessage(state),
  getSyncPending: selectGetSyncIsPending(state),
  language: selectLanguage(state),
});

const perform = dispatch => ({
  setSyncEnabled: value => dispatch(doSetWalletSyncPreference(value)),
  checkSync: () => dispatch(doCheckSync()),
  getSync: (pw, cb) => dispatch(doGetSync(pw, cb)),
  updatePreferences: () => dispatch(doGetAndPopulatePreferences()),
});

export default connect(select, perform)(SyncToggle);
