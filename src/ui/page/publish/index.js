import { connect } from 'react-redux';
import { selectBalance } from 'lbry-redux';
import { selectUnclaimedRewardValue } from 'lbryinc';
import PublishPage from './view';

const select = state => ({
  balance: selectBalance(state),
  totalRewardValue: selectUnclaimedRewardValue(state),
});

export default connect(
  select,
  null
)(PublishPage);
