import React from "react";
import { connect } from "react-redux";
import { doCloseModal, doAuthNavigate } from "actions/app";
import ModalRewardApprovalRequired from "./view";

// const select = (state, props) => {
//   const selectReward = makeSelectRewardByType();
//
//   return {
//     reward: selectReward(state, { reward_type: rewards.TYPE_NEW_USER }),
//   };
// };

const perform = dispatch => ({
  doAuth: () => dispatch(doAuthNavigate()),
  closeModal: () => dispatch(doCloseModal()),
});

export default connect(null, perform)(ModalRewardApprovalRequired);
