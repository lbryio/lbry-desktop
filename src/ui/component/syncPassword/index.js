import { connect } from 'react-redux';
import { doGetSync, selectGetSyncIsPending, selectUserEmail } from 'lbryinc';
import { doSetClientSetting } from 'redux/actions/settings';
import { doSignOut } from 'redux/actions/app';
import SyncPassword from './view';

const select = state => ({
  getSyncIsPending: selectGetSyncIsPending(state),
  email: selectUserEmail(state),
});

const perform = dispatch => ({
  getSync: password => dispatch(doGetSync(password)),
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  signOut: () => dispatch(doSignOut()),
});

export default connect(
  select,
  perform
)(SyncPassword);
