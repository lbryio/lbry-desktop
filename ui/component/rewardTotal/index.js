import { connect } from 'react-redux';
import { selectUnclaimedRewardValue, selectFetchingRewards, doRewardList, selectClaimedRewards } from 'lbryinc';
import RewardSummary from './view';

const select = state => ({
  unclaimedRewardAmount: selectUnclaimedRewardValue(state),
  fetching: selectFetchingRewards(state),
  rewards: selectClaimedRewards(state),
});

const perform = dispatch => ({
  fetchRewards: () => dispatch(doRewardList()),
});

export default connect(
  select,
  perform
)(RewardSummary);
