import React from "react";
import rewards from "rewards";
import { connect } from "react-redux";
import { doCloseModal, doAuthNavigate } from "actions/app";
import { doSetClientSetting } from "actions/settings";
import { selectUserIsRewardApproved } from "selectors/user";
import {
  makeSelectHasClaimedReward,
  makeSelectRewardByType,
  selectUnclaimedRewardValue,
} from "selectors/rewards";
import * as settings from "constants/settings";
import ModalCreditIntro from "./view";

const select = (state, props) => {
  const selectHasClaimed = makeSelectHasClaimedReward(),
    selectReward = makeSelectRewardByType();

  return {
    isRewardApproved: selectUserIsRewardApproved(state),
    reward: selectReward(state, { reward_type: rewards.TYPE_NEW_USER }),
    totalRewardValue: selectUnclaimedRewardValue(state),
  };
};

const perform = dispatch => () => {
  const closeModal = () => {
    dispatch(doSetClientSetting(settings.CREDIT_INTRO_ACKNOWLEDGED, true));
    dispatch(doCloseModal());
  };

  return {
    verifyAccount: () => {
      closeModal();
      dispatch(doAuthNavigate("/discover"));
    },
    closeModal: closeModal,
  };
};

export default connect(select, perform)(ModalCreditIntro);
