import { connect } from 'react-redux';
import { selectMyChannelClaims, doFetchChannelListMine, selectFetchingMyChannels } from 'lbry-redux';
import { selectYoutubeChannels } from 'lbryinc';
import ChannelsPage from './view';

const select = state => ({
  channels: selectMyChannelClaims(state),
  fetchingChannels: selectFetchingMyChannels(state),
  youtubeChannels: selectYoutubeChannels(state),
});

const perform = dispatch => ({
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
});

export default connect(
  select,
  perform
)(ChannelsPage);
