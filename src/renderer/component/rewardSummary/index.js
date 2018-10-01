import { connect } from 'react-redux';
import { selectUnclaimedRewardValue, selectFetchingRewards, doRewardList } from 'lbryinc';
import { doFetchRewardedContent } from 'redux/actions/content';
import RewardSummary from './view';

const select = state => ({
  unclaimedRewardAmount: selectUnclaimedRewardValue(state),
  fetching: selectFetchingRewards(state),
});

const perform = dispatch => ({
  fetchRewards: () => dispatch(doRewardList()),
  fetchRewardedContent: () => dispatch(doFetchRewardedContent()),
});

export default connect(
  select,
  perform
)(RewardSummary);
