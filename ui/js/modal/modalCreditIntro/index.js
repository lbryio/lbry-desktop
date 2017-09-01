import React from "react";
import { connect } from "react-redux";
import { doCloseModal } from "actions/app";
import { doAuthNavigate } from "actions/navigation";
import { doSetClientSetting } from "actions/settings";
import { selectUserIsRewardApproved } from "selectors/user";
import { selectBalance } from "selectors/wallet";
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
    currentBalance: selectBalance(state),
    isRewardApproved: selectUserIsRewardApproved(state),
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
