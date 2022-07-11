import { connect } from 'react-redux';
import { selectFetchingMyChannels } from 'redux/selectors/claims';
import { selectBalance } from 'redux/selectors/wallet';
import LivestreamCreatePage from './view';

const select = (state) => ({
  balance: selectBalance(state),
  fetchingChannels: selectFetchingMyChannels(state),
});

export default connect(select, null)(LivestreamCreatePage);
