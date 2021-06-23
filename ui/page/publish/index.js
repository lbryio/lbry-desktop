import { connect } from 'react-redux';
import { selectBalance, selectFetchingMyChannels } from 'lbry-redux';
import { selectUnclaimedRewardValue } from 'redux/selectors/rewards';
import PublishPage from './view';

const select = state => ({
  balance: selectBalance(state),
  totalRewardValue: selectUnclaimedRewardValue(state),
  fetchingChannels: selectFetchingMyChannels(state),
});

export default connect(select, null)(PublishPage);
