import React from "react";
import rewards from "rewards";
import { connect } from "react-redux";
import { doCloseModal } from "actions/app";
import { selectUserIsRewardApproved } from "selectors/user";
import {
  makeSelectHasClaimedReward,
  makeSelectClaimRewardError,
  makeSelectRewardByType,
} from "selectors/rewards";
import WelcomeModal from "./view";

const select = (state, props) => {
  const selectHasClaimed = makeSelectHasClaimedReward(),
    selectReward = makeSelectRewardByType();

  return {
    hasClaimed: selectHasClaimed(state, { reward_type: rewards.TYPE_NEW_USER }),
    isRewardApproved: selectUserIsRewardApproved(state),
    reward: selectReward(state, { reward_type: rewards.TYPE_NEW_USER }),
  };
};

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
});

export default connect(select, perform)(WelcomeModal);
