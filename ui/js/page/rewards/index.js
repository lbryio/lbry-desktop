import React from "react";
import { connect } from "react-redux";
import {
  makeSelectRewardByType,
  selectFetchingRewards,
  selectRewards,
} from "selectors/rewards";
import { selectUser } from "selectors/user";
import { doAuthNavigate, doNavigate } from "actions/app";
import { doRewardList } from "actions/rewards";
import rewards from "rewards";
import RewardsPage from "./view";

const select = (state, props) => {
  const selectReward = makeSelectRewardByType();

  return {
    fetching: selectFetchingRewards(state),
    rewards: selectRewards(state),
    newUserReward: selectReward(state, { reward_type: rewards.TYPE_NEW_USER }),
    user: selectUser(state),
  };
};

const perform = dispatch => ({
  fetchRewards: () => dispatch(doRewardList()),
  navigate: path => dispatch(doNavigate(path)),
  doAuth: () => {
    dispatch(doAuthNavigate("/rewards"));
  },
});

export default connect(select, perform)(RewardsPage);
