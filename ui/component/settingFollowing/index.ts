//@ts-nocheck
import {connect} from 'react-redux';
import { selectSubscriptions, selectFollowing } from 'redux/selectors/subscriptions';
import { doImportFollowing } from 'redux/actions/subscriptions';
import SettingFollowing from './view';

const select = (state: unknown) => ({
  subscriptions: selectSubscriptions(state),
  following: selectFollowing(state),
});

const perform = (dispatch: unknown) => ({
  importFollowing: (text) => dispatch(doImportFollowing(text)),
});

export default connect(select, perform)(SettingFollowing);
