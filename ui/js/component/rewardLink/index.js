import React from "react";
import { connect } from "react-redux";
import {
  makeSelectHasClaimedReward,
  makeSelectClaimRewardError,
  makeSelectRewardByType,
  makeSelectIsRewardClaimPending,
} from "selectors/rewards";
import { doNavigate } from "actions/app";
import { doClaimReward, doClaimRewardClearError } from "actions/rewards";
import RewardLink from "./view";

const makeSelect = () => {
  const selectHasClaimedReward = makeSelectHasClaimedReward();
  const selectIsPending = makeSelectIsRewardClaimPending();
  const selectReward = makeSelectRewardByType();
  const selectError = makeSelectClaimRewardError();

  const select = (state, props) => ({
    isClaimed: selectHasClaimedReward(state, props),
    errorMessage: selectError(state, props),
    isPending: selectIsPending(state, props),
    reward: select,
  });

  return select;
};

const perform = dispatch => ({
  claimReward: reward => dispatch(doClaimReward(reward)),
  clearError: reward => dispatch(doClaimRewardClearError(reward)),
  navigate: path => dispatch(doNavigate(path)),
});

export default connect(makeSelect, perform)(RewardLink);
