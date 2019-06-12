import { connect } from 'react-redux';
import SelectChannel from './view';
import {
  selectBalance,
  selectMyChannelClaims,
  selectFetchingMyChannels,
  doFetchChannelListMine,
  doCreateChannel,
} from 'lbry-redux';

const select = state => ({
  channels: selectMyChannelClaims(state),
  fetchingChannels: selectFetchingMyChannels(state),
  balance: selectBalance(state),
});

const perform = dispatch => ({
  createChannel: (name, amount) => dispatch(doCreateChannel(name, amount)),
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
});

export default connect(
  select,
  perform
)(SelectChannel);
