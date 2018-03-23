import { connect } from 'react-redux';
import SelectChannel from './view';
import { selectMyChannelClaims, selectFetchingMyChannels } from 'redux/selectors/claims';
import { doFetchChannelListMine, doCreateChannel } from 'redux/actions/content';
import { selectBalance } from 'redux/selectors/wallet';

const select = state => ({
  channels: selectMyChannelClaims(state),
  fetchingChannels: selectFetchingMyChannels(state),
  balance: selectBalance(state),
});

const perform = dispatch => ({
  createChannel: (name, amount) => dispatch(doCreateChannel(name, amount)),
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
});

export default connect(select, perform)(SelectChannel);
