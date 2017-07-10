import React from "react";
import { connect } from "react-redux";
import { doNavigate, doHistoryBack } from "actions/app";
import { doClaimRewardType } from "actions/rewards";
import {
  selectMyClaims,
  selectFetchingMyChannels,
  selectMyChannelClaims,
} from "selectors/claims";
import { doFetchClaimListMine, doFetchChannelListMine } from "actions/content";
import rewards from "rewards";
import PublishPage from "./view";

const select = state => ({
  myClaims: selectMyClaims(state),
  fetchingChannels: selectFetchingMyChannels(state),
  channels: selectMyChannelClaims(state),
});

const perform = dispatch => ({
  back: () => dispatch(doHistoryBack()),
  navigate: path => dispatch(doNavigate(path)),
  fetchClaimListMine: () => dispatch(doFetchClaimListMine()),
  claimFirstChannelReward: () =>
    dispatch(doClaimRewardType(rewards.TYPE_FIRST_CHANNEL)),
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
});

export default connect(select, perform)(PublishPage);
