import { connect } from 'react-redux';
import { selectUnclaimedRewardValue, selectFetchingRewards } from 'redux/selectors/rewards';
import { doRewardList } from 'redux/actions/rewards';
import RewardSummary from './view';

const select = state => ({
  unclaimedRewardAmount: selectUnclaimedRewardValue(state),
  fetching: selectFetchingRewards(state),
});

const perform = dispatch => ({
  fetchRewards: () => dispatch(doRewardList()),
});

export default connect(
  select,
  perform
)(RewardSummary);
