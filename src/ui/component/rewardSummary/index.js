import { connect } from 'react-redux';
import { selectUnclaimedRewardValue, selectFetchingRewards, doFetchRewardedContent } from 'lbryinc';
import RewardSummary from './view';

const select = state => ({
  unclaimedRewardAmount: selectUnclaimedRewardValue(state),
  fetching: selectFetchingRewards(state),
});

const perform = dispatch => ({
  fetchRewardedContent: () => dispatch(doFetchRewardedContent()),
});

export default connect(
  select,
  perform
)(RewardSummary);
