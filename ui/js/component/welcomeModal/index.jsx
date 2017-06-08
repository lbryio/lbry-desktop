import React from "react";
import { connect } from "react-redux";
import { doCloseModal } from "actions/app";
import { selectUserIsRewardApproved } from "selectors/user";
import { makeSelectHasClaimedReward } from "selectors/rewards";
import WelcomeModal from "./view";

const select = (state, props) => {
  const selectHasReward = makeSelectHasClaimedReward();

  return {
    hasReward: selectHasReward(state, { reward_type: "new_user" }),
    isRewardApproved: selectUserIsRewardApproved(state),
    rewardAmount: 5,
  };
};

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
});

export default connect(select, perform)(WelcomeModal);
