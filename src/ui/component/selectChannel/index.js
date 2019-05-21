import { connect } from 'react-redux';
import SelectChannel from './view';
import {
  selectBalance,
  selectMyChannelClaims,
  selectFetchingMyChannels,
  selectMyActiveChannelUri,
  doFetchChannelListMine,
  doCreateChannel,
  doSetMyActiveChannelUri,
} from 'lbry-redux';

const select = state => ({
  channels: selectMyChannelClaims(state),
  fetchingChannels: selectFetchingMyChannels(state),
  balance: selectBalance(state),
  activeChannelUri: selectMyActiveChannelUri(state),
});

const perform = dispatch => ({
  createChannel: (name, amount) => dispatch(doCreateChannel(name, amount)),
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
  setMyActiveChannelUri: activeChannelUri => dispatch(doSetMyActiveChannelUri(activeChannelUri)),
});

export default connect(
  select,
  perform
)(SelectChannel);
