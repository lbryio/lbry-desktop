import React from "react";
import rewards from "rewards";
import { connect } from "react-redux";
import { doCloseModal } from "redux/actions/app";
import { makeSelectRewardByType } from "redux/selectors/rewards";
import ModalFirstReward from "./view";

const select = (state, props) => {
  const selectReward = makeSelectRewardByType();

  return {
    reward: selectReward(state, { reward_type: rewards.TYPE_CONFIRM_EMAIL }),
  };
};

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
});

export default connect(select, perform)(ModalFirstReward);
