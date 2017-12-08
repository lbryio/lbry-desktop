import React from "react";
import { connect } from "react-redux";
import { doUserEmailNew, doUserInviteNew } from "redux/actions/user";
import {
  selectEmailNewIsPending,
  selectEmailNewErrorMessage,
} from "redux/selectors/user";
import UserEmailNew from "./view";
import rewards from "rewards";
import { makeSelectRewardAmountByType } from "redux/selectors/rewards";

const select = state => ({
  isPending: selectEmailNewIsPending(state),
  errorMessage: selectEmailNewErrorMessage(state),
  rewardAmount: makeSelectRewardAmountByType()(state, {
    reward_type: rewards.TYPE_CONFIRM_EMAIL,
  }),
});

const perform = dispatch => ({
  addUserEmail: email => dispatch(doUserEmailNew(email)),
});

export default connect(select, perform)(UserEmailNew);
