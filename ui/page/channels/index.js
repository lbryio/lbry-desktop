import { connect } from 'react-redux';
import { selectMyChannelUrls, selectFetchingMyChannels } from 'redux/selectors/claims';
import { doFetchChannelListMine } from 'redux/actions/claims';
import { doSetActiveChannel } from 'redux/actions/app';
import ChannelsPage from './view';

const select = (state) => {
  return {
    channelUrls: selectMyChannelUrls(state),
    fetchingChannels: selectFetchingMyChannels(state),
  };
};

const perform = (dispatch) => ({
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
  doSetActiveChannel: (claimId) => dispatch(doSetActiveChannel(claimId)),
});

export default connect(select, perform)(ChannelsPage);
