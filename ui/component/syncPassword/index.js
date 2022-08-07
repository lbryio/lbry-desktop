import { connect } from 'react-redux';
import { selectGetSyncIsPending, selectSyncApplyPasswordError } from 'redux/selectors/sync';
import { doGetSyncDesktop } from 'redux/actions/sync';
import { doSetClientSetting } from 'redux/actions/settings';
import { doSignOut, doHandleSyncComplete } from 'redux/actions/app';
import SyncPassword from './view';

const select = (state) => ({
  getSyncIsPending: selectGetSyncIsPending(state),
  passwordError: selectSyncApplyPasswordError(state),
  // bring email in from new sync system
});

const perform = (dispatch) => ({
  getSync: (cb, password) => dispatch(doGetSyncDesktop(cb, password)),
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  handleSyncComplete: (error, hasDataChanged) => dispatch(doHandleSyncComplete(error, hasDataChanged)),
  signOut: () => dispatch(doSignOut()),
});

export default connect(select, perform)(SyncPassword);
