import React from "react";
import rewards from "rewards";
import { connect } from "react-redux";
import { doCloseModal, doNavigate } from "actions/app";
import { doSetClientSetting } from "actions/settings";
import { selectUserIsRewardApproved } from "selectors/user";
import {
  makeSelectHasClaimedReward,
  makeSelectRewardByType,
} from "selectors/rewards";
import ModalWelcome from "./view";

const select = (state, props) => {
  const selectHasClaimed = makeSelectHasClaimedReward(),
    selectReward = makeSelectRewardByType();

  return {
    hasClaimed: selectHasClaimed(state, { reward_type: rewards.TYPE_NEW_USER }),
    isRewardApproved: selectUserIsRewardApproved(state),
    reward: selectReward(state, { reward_type: rewards.TYPE_NEW_USER }),
  };
};

const perform = dispatch => () => {
  const closeModal = () => {
    dispatch(doSetClientSetting("welcome_acknowledged", true));
    dispatch(doCloseModal());
  };

  return {
    verifyAccount: () => {
      closeModal();
      dispatch(doNavigate("/auth"));
    },
    closeModal: closeModal,
  };
};

export default connect(select, perform)(ModalWelcome);
