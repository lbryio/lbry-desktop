import { connect } from 'react-redux';
import { selectMyChannelClaims, selectFetchingMyChannels, selectPendingClaims } from 'lbry-redux';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import LivestreamSetupPage from './view';

const select = (state) => ({
  channels: selectMyChannelClaims(state),
  fetchingChannels: selectFetchingMyChannels(state),
  activeChannelClaim: selectActiveChannelClaim(state),
  pendingClaims: selectPendingClaims(state),
});

export default connect(select)(LivestreamSetupPage);
