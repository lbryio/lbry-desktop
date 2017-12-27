import React from 'react';
import { connect } from 'react-redux';
import { doNavigate, doHistoryBack } from 'redux/actions/navigation';
import { doClaimRewardType } from 'redux/actions/rewards';
import {
  selectMyClaims,
  selectFetchingMyChannels,
  selectMyChannelClaims,
  selectClaimsByUri,
} from 'redux/selectors/claims';
import { selectResolvingUris } from 'redux/selectors/content';
import {
  doFetchClaimListMine,
  doFetchChannelListMine,
  doResolveUri,
  doCreateChannel,
  doPublish,
} from 'redux/actions/content';
import { selectBalance } from 'redux/selectors/wallet';
import rewards from 'rewards';
import PublishPage from './view';

const select = state => ({
  balance: selectBalance(state),
  myClaims: selectMyClaims(state),
  fetchingChannels: selectFetchingMyChannels(state),
  channels: selectMyChannelClaims(state),
  claimsByUri: selectClaimsByUri(state),
  resolvingUris: selectResolvingUris(state),
});

const perform = dispatch => ({
  back: () => dispatch(doHistoryBack()),
  navigate: path => dispatch(doNavigate(path)),
  fetchClaimListMine: () => dispatch(doFetchClaimListMine()),
  claimFirstChannelReward: () => dispatch(doClaimRewardType(rewards.TYPE_FIRST_CHANNEL)),
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
  resolveUri: uri => dispatch(doResolveUri(uri)),
  createChannel: (name, amount) => dispatch(doCreateChannel(name, amount)),
  publish: params => dispatch(doPublish(params)),
});

export default connect(select, perform)(PublishPage);
