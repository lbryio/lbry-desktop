import { connect } from 'react-redux';
import { selectUser } from 'redux/selectors/user';
import { selectFetchingRewards, selectUnclaimedRewards, selectClaimedRewards } from 'redux/selectors/rewards';
import { doUserFetch } from 'redux/actions/user';
import { doRewardList } from 'redux/actions/rewards';
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
  fetchUser: () => dispatch(doUserFetch()),
});

export default connect(select, perform)(RewardsPage);
