import { connect } from 'react-redux';
import { doGetSync, selectGetSyncIsPending, selectUserEmail, selectSyncApplyPasswordError } from 'lbryinc';
import { doSetClientSetting } from 'redux/actions/settings';
import { doSignOut } from 'redux/actions/app';
import SyncPassword from './view';

const select = state => ({
  getSyncIsPending: selectGetSyncIsPending(state),
  email: selectUserEmail(state),
  passwordError: selectSyncApplyPasswordError(state),
});

const perform = dispatch => ({
  getSync: (password, cb) => dispatch(doGetSync(password, cb)),
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  signOut: () => dispatch(doSignOut()),
});

export default connect(
  select,
  perform
)(SyncPassword);
