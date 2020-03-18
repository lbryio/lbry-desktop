import { connect } from 'react-redux';
import { selectMyChannelClaims, selectFetchingMyChannels, doPrepareEdit } from 'lbry-redux';
import CreatorAnalytics from './view';

const select = state => ({
  channels: selectMyChannelClaims(state),
  fetchingChannels: selectFetchingMyChannels(state),
});

const perform = dispatch => ({
  prepareEdit: channelName => dispatch(doPrepareEdit({ signing_channel: { name: channelName } })),
});

export default connect(select, perform)(CreatorAnalytics);
