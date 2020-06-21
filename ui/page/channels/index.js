import { connect } from 'react-redux';
import {
  selectMyChannelClaims,
  selectMyChannelUrls,
  doFetchChannelListMine,
  selectFetchingMyChannels,
} from 'lbry-redux';
import { selectYoutubeChannels } from 'redux/selectors/user';
import { doOpenModal } from 'redux/actions/app';
import ChannelsPage from './view';

const select = state => ({
  channelUrls: selectMyChannelUrls(state),
  channels: selectMyChannelClaims(state),
  fetchingChannels: selectFetchingMyChannels(state),
  youtubeChannels: selectYoutubeChannels(state),
});

const perform = dispatch => ({
  openModal: id => dispatch(doOpenModal(id)),
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
});

export default connect(select, perform)(ChannelsPage);
