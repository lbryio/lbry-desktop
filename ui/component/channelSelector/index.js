import { connect } from 'react-redux';
import SelectChannel from './view';
import {
  selectBalance,
  selectMyChannelClaims,
  selectFetchingMyChannels,
  doFetchChannelListMine,
  doCreateChannel,
} from 'lbry-redux';
import { selectUserVerifiedEmail } from 'lbryinc';

const select = state => ({
  channels: selectMyChannelClaims(state),
  fetchingChannels: selectFetchingMyChannels(state),
  balance: selectBalance(state),
  emailVerified: selectUserVerifiedEmail(state),
});

const perform = dispatch => ({
  createChannel: (name, amount) => dispatch(doCreateChannel(name, amount)),
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
});

export default connect(select, perform)(SelectChannel);
