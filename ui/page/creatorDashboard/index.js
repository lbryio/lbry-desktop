import { connect } from 'react-redux';
import { selectMyChannelClaims, selectFetchingMyChannels } from 'lbry-redux';
import CreatorDashboardPage from './view';

const select = state => ({
  channels: selectMyChannelClaims(state),
  fetchingChannels: selectFetchingMyChannels(state),
});

export default connect(select)(CreatorDashboardPage);
