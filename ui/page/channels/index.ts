//@ts-nocheck
import {connect} from 'react-redux';
import { selectMyChannelUrls, selectFetchingMyChannels, makeSelectClaimIsPending } from 'redux/selectors/claims';
import { doFetchChannelListMine } from 'redux/actions/claims';
import { doSetActiveChannel } from 'redux/actions/app';
import { selectYoutubeChannels } from 'redux/selectors/user';
import ChannelsPage from './view';

const select = (state: unknown) => {
  const channelUrls = selectMyChannelUrls(state);
  let pendingChannels: unknown = [];
  if (channelUrls) {
    channelUrls.map((channelUrl) => {
      const isPendingUrl = makeSelectClaimIsPending(channelUrl)(state);
      if (isPendingUrl) pendingChannels.push(channelUrl);
    });
  }

  return {
    channelUrls,
    fetchingChannels: selectFetchingMyChannels(state),
    youtubeChannels: selectYoutubeChannels(state),
    pendingChannels,
  };
};

const perform = (dispatch: unknown) => ({
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
  doSetActiveChannel: (claimId) => dispatch(doSetActiveChannel(claimId)),
});

export default connect(select, perform)(ChannelsPage);
