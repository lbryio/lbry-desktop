import { connect } from 'react-redux';
import { selectHasChannels, selectFetchingMyChannels } from 'redux/selectors/claims';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import CreatorDashboardPage from './view';

const select = (state) => ({
  hasChannels: selectHasChannels(state),
  fetchingChannels: selectFetchingMyChannels(state),
  activeChannelClaim: selectActiveChannelClaim(state),
});

export default connect(select)(CreatorDashboardPage);
