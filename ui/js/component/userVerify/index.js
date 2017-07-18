import React from "react";
import { connect } from "react-redux";
import { doUserIdentityVerify } from "actions/user";
import rewards from "rewards";
import { makeSelectRewardByType } from "selectors/rewards";
import {
  selectIdentityVerifyIsPending,
  selectIdentityVerifyErrorMessage,
} from "selectors/user";
import UserVerify from "./view";

const select = (state, props) => {
  const selectReward = makeSelectRewardByType();

  return {
    isPending: selectIdentityVerifyIsPending(state),
    errorMessage: selectIdentityVerifyErrorMessage(state),
    reward: selectReward(state, { reward_type: rewards.TYPE_NEW_USER }),
  };
};

const perform = dispatch => ({
  verifyUserIdentity: token => dispatch(doUserIdentityVerify(token)),
});

export default connect(select, perform)(UserVerify);
