import React from "react";
import { connect } from "react-redux";
import {
  makeSelectRewardByType,
  selectFetchingRewards,
  selectRewards,
} from "selectors/rewards";
import {
  selectUserIsRewardEligible,
  selectUserHasEmail,
  selectUserIsVerificationCandidate,
} from "selectors/user";
import { doRewardList } from "actions/rewards";
import rewards from "rewards";
import RewardsPage from "./view";

const select = (state, props) => {
  const selectReward = makeSelectRewardByType();

  return {
    fetching: selectFetchingRewards(state),
    rewards: selectRewards(state),
    hasEmail: selectUserHasEmail(state),
    isEligible: selectUserIsRewardEligible(state),
    isVerificationCandidate: selectUserIsVerificationCandidate(state),
    newUserReward: selectReward(state, { reward_type: rewards.TYPE_NEW_USER }),
  };
};

const perform = dispatch => ({
  fetchRewards: () => dispatch(doRewardList()),
});

export default connect(select, perform)(RewardsPage);
