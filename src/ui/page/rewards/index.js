import { connect } from 'react-redux';
import { selectFetchingRewards, selectUnclaimedRewards, selectClaimedRewards, selectUser, doRewardList } from 'lbryinc';
import { selectDaemonSettings } from 'redux/selectors/settings';
import RewardsPage from './view';

const select = state => ({
  daemonSettings: selectDaemonSettings(state),
  fetching: selectFetchingRewards(state),
  rewards: selectUnclaimedRewards(state),
  claimed: selectClaimedRewards(state),
  user: selectUser(state),
});

const perform = dispatch => ({
  fetchRewards: () => dispatch(doRewardList()),
});

export default connect(
  select,
  perform
)(RewardsPage);
