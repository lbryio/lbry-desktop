import React from "react";
import { connect } from "react-redux";
import { doNavigate, doHistoryBack } from "actions/navigation";
import { doClaimRewardType } from "actions/rewards";
import {
  selectMyClaims,
  selectFetchingMyChannels,
  selectMyChannelClaims,
  selectClaimsByUri,
} from "selectors/claims";
import { selectResolvingUris } from "selectors/content";
import { makeSelectCostInfoForUri } from "selectors/cost_info";
import {
  doFetchClaimListMine,
  doFetchChannelListMine,
  doResolveUri,
  doCreateChannel,
  doPublish,
} from "actions/content";
import { selectBalance } from "selectors/wallet";
import rewards from "rewards";
import PublishPage from "./view";

const select = (state, props) => ({
  balance: selectBalance(state),
  myClaims: selectMyClaims(state),
  fetchingChannels: selectFetchingMyChannels(state),
  channels: selectMyChannelClaims(state),
  claimsByUri: selectClaimsByUri(state),
  resolvingUris: selectResolvingUris(state),
  costInfo: makeSelectCostInfoForUri(props.params.uri || state.uri)(state),
});

const perform = dispatch => ({
  back: () => dispatch(doHistoryBack()),
  navigate: path => dispatch(doNavigate(path)),
  fetchClaimListMine: () => dispatch(doFetchClaimListMine()),
  claimFirstChannelReward: () =>
    dispatch(doClaimRewardType(rewards.TYPE_FIRST_CHANNEL)),
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
  resolveUri: uri => dispatch(doResolveUri(uri)),
  createChannel: (name, amount) => dispatch(doCreateChannel(name, amount)),
  publish: params => dispatch(doPublish(params)),
});

export default connect(select, perform)(PublishPage);
