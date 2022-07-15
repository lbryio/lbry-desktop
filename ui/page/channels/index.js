import { connect } from 'react-redux';
import {
  selectMyChannelUrls,
  selectFetchingMyChannels,
  makeSelectClaimIsPending,
  selectPendingIds,
  selectClaimsByUri,
} from 'redux/selectors/claims';
import { doFetchUserMemberships } from 'redux/actions/user';
import { doFetchChannelListMine } from 'redux/actions/claims';
import { doSetActiveChannel } from 'redux/actions/app';
import { selectYoutubeChannels } from 'redux/selectors/user';
import ChannelsPage from './view';

const select = (state) => {
  const channelUrls = selectMyChannelUrls(state);
  const pendingIds = selectPendingIds(state);

  let pendingChannels = [];
  if (channelUrls && pendingIds.length > 0) {
    // TODO: should move this into a memoized selector, as this is a hot area.
    // For now, I added a check to skip this loop when there are no pending
    // channels, which is usually the case.
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
    claimsByUri: selectClaimsByUri(state),
  };
};

const perform = (dispatch) => ({
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
  doSetActiveChannel: (claimId) => dispatch(doSetActiveChannel(claimId)),
  doFetchUserMemberships: (claimIds) => dispatch(doFetchUserMemberships(claimIds)),
});

export default connect(select, perform)(ChannelsPage);
