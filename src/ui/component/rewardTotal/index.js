import { connect } from 'react-redux';
import {
  selectUnclaimedRewardValue,
  selectFetchingRewards,
  doRewardList,
  doFetchRewardedContent,
  selectClaimedRewards,
} from 'lbryinc';
import RewardSummary from './view';

const select = state => ({
  unclaimedRewardAmount: selectUnclaimedRewardValue(state),
  fetching: selectFetchingRewards(state),
  rewards: selectClaimedRewards(state),
});

const perform = dispatch => ({
  fetchRewards: () => dispatch(doRewardList()),
  fetchRewardedContent: () => dispatch(doFetchRewardedContent()),
});

export default connect(
  select,
  perform
)(RewardSummary);
