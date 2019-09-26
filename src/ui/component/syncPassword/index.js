import { connect } from 'react-redux';
import { doGetSync, selectGetSyncIsPending } from 'lbryinc';
import { doSetClientSetting } from 'redux/actions/settings';
import SyncPassword from './view';

const select = state => ({
  getSyncIsPending: selectGetSyncIsPending(state),
});

const perform = dispatch => ({
  getSync: password => dispatch(doGetSync(password)),
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
});

export default connect(
  select,
  perform
)(SyncPassword);
