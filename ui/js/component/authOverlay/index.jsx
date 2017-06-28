import React from "react";
import * as modal from "constants/modal_types";
import rewards from "rewards.js";
import { connect } from "react-redux";
import { doUserEmailDecline } from "actions/user";
import { doOpenModal } from "actions/app";
import {
  selectAuthenticationIsPending,
  selectUserHasEmail,
  selectUserIsAuthRequested,
} from "selectors/user";
import { makeSelectHasClaimedReward } from "selectors/rewards";
import AuthOverlay from "./view";

const select = (state, props) => {
  const selectHasClaimed = makeSelectHasClaimedReward();

  return {
    hasEmail: selectUserHasEmail(state),
    isPending: selectAuthenticationIsPending(state),
    isShowing: selectUserIsAuthRequested(state),
    hasNewUserReward: selectHasClaimed(state, {
      reward_type: rewards.TYPE_NEW_USER,
    }),
  };
};

const perform = dispatch => ({
  userEmailDecline: () => dispatch(doUserEmailDecline()),
  openWelcomeModal: () => dispatch(doOpenModal(modal.WELCOME)),
});

export default connect(select, perform)(AuthOverlay);
