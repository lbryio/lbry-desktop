import { connect } from 'react-redux';
import { selectUnclaimedRewardValue, selectFetchingRewards } from 'lbryinc';
import RewardSummary from './view';

const select = state => ({
  unclaimedRewardAmount: selectUnclaimedRewardValue(state),
  fetching: selectFetchingRewards(state),
});

export default connect(
  select,
  null
)(RewardSummary);
