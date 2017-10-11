import React from "react";
import rewards from "rewards";
import { connect } from "react-redux";
import { doFetchClaimListMine } from "actions/content";
import {
  selectMyClaimsWithoutChannels,
  selectIsFetchingClaimListMine,
} from "selectors/claims";
import { doClaimRewardType } from "actions/rewards";
import { doNavigate } from "actions/navigation";
import FileListPublished from "./view";

const select = state => ({
  claims: selectMyClaimsWithoutChannels(state),
  isFetching: selectIsFetchingClaimListMine(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
  fetchClaims: () => dispatch(doFetchClaimListMine()),
  claimFirstPublishReward: () =>
    dispatch(doClaimRewardType(rewards.TYPE_FIRST_PUBLISH)),
});

export default connect(select, perform)(FileListPublished);
