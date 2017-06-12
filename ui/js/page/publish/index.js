import React from "react";
import { connect } from "react-redux";
import { doNavigate, doHistoryBack } from "actions/app";
import { doClaimRewardType } from "actions/rewards";
import {
  selectMyClaims,
  selectFetchingMyChannels,
  selectMyChannelClaims,
  selectClaimsByUri,
} from "selectors/claims";
import { selectResolvingUris } from "selectors/content";
import {
  doFetchClaimListMine,
  doFetchChannelListMine,
  doResolveUri,
} from "actions/content";
import rewards from "rewards";
import PublishPage from "./view";

const select = state => ({
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
  claimFirstChannelReward: () =>
    dispatch(doClaimRewardType(rewards.TYPE_FIRST_CHANNEL)),
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(PublishPage);
