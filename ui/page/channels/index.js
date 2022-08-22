import { connect } from 'react-redux';
import {
  selectMyChannelClaimUrls,
  selectMyChannelClaimIds,
  selectFetchingMyChannels,
  selectPendingIds,
  selectClaimsByUri,
} from 'redux/selectors/claims';
import { doFetchUserMemberships } from 'redux/actions/user';
import { doUserViewRateList } from 'redux/actions/rewards';
import { doFetchChannelListMine } from 'redux/actions/claims';
import { doSetActiveChannel } from 'redux/actions/app';
import { selectHasYoutubeChannels } from 'redux/selectors/user';
import { selectViewRateById } from 'redux/selectors/rewards';

import ChannelsPage from './view';

const select = (state) => ({
  channelUrls: selectMyChannelClaimUrls(state),
  channelIds: selectMyChannelClaimIds(state),
  fetchingChannels: selectFetchingMyChannels(state),
  hasYoutubeChannels: selectHasYoutubeChannels(state),
  pendingIds: selectPendingIds(state),
  viewRateById: selectViewRateById(state),
  claimsByUri: selectClaimsByUri(state),
});

const perform = {
  doFetchChannelListMine,
  doSetActiveChannel,
  doFetchUserMemberships,
  doUserViewRateList,
};

export default connect(select, perform)(ChannelsPage);
