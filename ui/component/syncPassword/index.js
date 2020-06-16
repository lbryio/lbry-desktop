import { connect } from 'react-redux';
import { doGetSync, selectGetSyncIsPending, selectSyncApplyPasswordError } from 'lbryinc';
import { selectUserEmail } from 'redux/selectors/user';
import { doSetClientSetting } from 'redux/actions/settings';
import { doSignOut, doHandleSyncComplete } from 'redux/actions/app';
import SyncPassword from './view';

const select = state => ({
  getSyncIsPending: selectGetSyncIsPending(state),
  email: selectUserEmail(state),
  passwordError: selectSyncApplyPasswordError(state),
});

const perform = dispatch => ({
  getSync: (password, cb) => dispatch(doGetSync(password, cb)),
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  handleSyncComplete: (error, hasDataChanged) => dispatch(doHandleSyncComplete(error, hasDataChanged)),
  signOut: () => dispatch(doSignOut()),
});

export default connect(select, perform)(SyncPassword);
