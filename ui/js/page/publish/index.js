import React from "react";
import { connect } from "react-redux";
import { doNavigate, doHistoryBack, doOpenModal } from "actions/app";
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
  doCreateChannel,
  doPublish,
} from "actions/content";
import { selectBalance } from "selectors/wallet";
import rewards from "rewards";
import PublishPage from "./view";
import * as modals from "constants/modal_types";

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
  claimFirstChannelReward: () =>
    dispatch(doClaimRewardType(rewards.TYPE_FIRST_CHANNEL)),
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
  resolveUri: uri => dispatch(doResolveUri(uri)),
  createChannel: (name, amount) => dispatch(doCreateChannel(name, amount)),
  publish: params => dispatch(doPublish(params)),
  openInsufficientCreditsModal: () =>
    dispatch(doOpenModal(modals.INSUFFICIENT_CREDITS)),
});

export default connect(select, perform)(PublishPage);
