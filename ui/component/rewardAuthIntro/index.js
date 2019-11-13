import { connect } from 'react-redux';
import { selectUnclaimedRewardValue } from 'lbryinc';
import RewardAuthIntro from './view';

const select = state => ({
  totalRewardValue: selectUnclaimedRewardValue(state),
});

export default connect(
  select,
  null
)(RewardAuthIntro);
