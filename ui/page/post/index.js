import { connect } from 'react-redux';
import { selectFetchingMyChannels } from 'redux/selectors/claims';
import { selectBalance } from 'redux/selectors/wallet';
import { selectUnclaimedRewardValue } from 'redux/selectors/rewards';
import PostPage from './view';

const select = (state) => ({
  balance: selectBalance(state),
  totalRewardValue: selectUnclaimedRewardValue(state),
  fetchingChannels: selectFetchingMyChannels(state),
});

export default connect(select, null)(PostPage);
