import { connect } from 'react-redux';
import {
  selectMyChannelClaims,
  selectMyChannelUrls,
  doFetchChannelListMine,
  selectFetchingMyChannels,
} from 'lbry-redux';
import { doSetActiveChannel } from 'redux/actions/app';
import { selectYoutubeChannels } from 'redux/selectors/user';
import ChannelsPage from './view';

const select = (state) => ({
  channelUrls: selectMyChannelUrls(state),
  channels: selectMyChannelClaims(state),
  fetchingChannels: selectFetchingMyChannels(state),
  youtubeChannels: selectYoutubeChannels(state),
});

const perform = (dispatch) => ({
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
  doSetActiveChannel: (claimId) => dispatch(doSetActiveChannel(claimId)),
});

export default connect(select, perform)(ChannelsPage);
