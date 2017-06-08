import React from "react";
import { connect } from "react-redux";
import { doNavigate } from "actions/app";
import { selectFetchingRewards, selectRewards } from "selectors/rewards";
import {
  selectUserIsRewardEligible,
  selectUserHasEmail,
  selectUserIsVerificationCandidate,
} from "selectors/user";
import RewardsPage from "./view";

const select = state => ({
  fetching: selectFetchingRewards(state),
  rewards: selectRewards(state),
  hasEmail: selectUserHasEmail(state),
  isEligible: selectUserIsRewardEligible(state),
  isVerificationCandidate: selectUserIsVerificationCandidate(state),
});

export default connect(select, null)(RewardsPage);
