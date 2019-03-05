import { connect } from 'react-redux';
import { selectClaimedRewards } from 'lbryinc';
import RewardListClaimed from './view';

const select = state => ({
  rewards: selectClaimedRewards(state),
});

export default connect(
  select,
  null
)(RewardListClaimed);
