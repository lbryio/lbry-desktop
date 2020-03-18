import { connect } from 'react-redux';
import { selectMyChannelClaims, selectFetchingMyChannels } from 'lbry-redux';
import Welcome from './view';

const select = state => ({
  channels: selectMyChannelClaims(state),
  fetchingChannels: selectFetchingMyChannels(state),
});

export default connect(select)(Welcome);
