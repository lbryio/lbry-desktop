import { connect } from 'react-redux';
import { selectMyChannelClaims, doFetchChannelListMine, selectFetchingMyChannels } from 'lbry-redux';
import { selectYoutubeChannels } from 'lbryinc';
import { doOpenModal } from 'redux/actions/app';
import ChannelsPage from './view';

const select = state => ({
  channels: selectMyChannelClaims(state),
  fetchingChannels: selectFetchingMyChannels(state),
  youtubeChannels: selectYoutubeChannels(state),
});

const perform = dispatch => ({
  openModal: id => dispatch(doOpenModal(id)),
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
});

export default connect(
  select,
  perform
)(ChannelsPage);
