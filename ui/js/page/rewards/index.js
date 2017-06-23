import React from "react";
import { connect } from "react-redux";
import { doNavigate } from "actions/app";
import { selectFetchingRewards, selectRewards } from "selectors/rewards";
import {
  selectUserIsRewardEligible,
  selectUserHasEmail,
  selectUserIsVerificationCandidate,
} from "selectors/user";
import { doRewardList } from "actions/rewards";
import RewardsPage from "./view";

const select = state => ({
  fetching: selectFetchingRewards(state),
  rewards: selectRewards(state),
  hasEmail: selectUserHasEmail(state),
  isEligible: selectUserIsRewardEligible(state),
  isVerificationCandidate: selectUserIsVerificationCandidate(state),
});

const perform = dispatch => ({
  fetchRewards: () => dispatch(doRewardList()),
});

export default connect(select, perform)(RewardsPage);
