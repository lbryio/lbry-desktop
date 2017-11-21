import React from "react";
import { connect } from "react-redux";
import {
  selectFetchingRewards,
  selectUnclaimedRewards,
} from "redux/selectors/rewards";
import { selectUser } from "redux/selectors/user";
import { doAuthNavigate, doNavigate } from "redux/actions/navigation";
import { doRewardList } from "redux/actions/rewards";
import RewardsPage from "./view";

const select = (state, props) => {
  return {
    fetching: selectFetchingRewards(state),
    rewards: selectUnclaimedRewards(state),
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
