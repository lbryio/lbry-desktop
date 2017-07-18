import React from "react";
import { doNavigate } from "actions/app";
import { connect } from "react-redux";
import {
  selectAuthenticationIsPending,
  selectUserHasEmail,
  selectEmailToVerify,
  selectUserIsVerificationCandidate,
  selectUser,
  selectUserIsPending,
  selectIdentityVerifyIsPending,
} from "selectors/user";
import AuthPage from "./view";

const select = state => ({
  isPending:
    selectAuthenticationIsPending(state) ||
      selectUserIsPending(state) ||
      selectIdentityVerifyIsPending(state),
  email: selectEmailToVerify(state),
  hasEmail: selectUserHasEmail(state),
  user: selectUser(state),
  isVerificationCandidate: selectUserIsVerificationCandidate(state),
});

const perform = dispatch => ({
  onAuthComplete: () => dispatch(doNavigate("/discover")),
});

export default connect(select, perform)(AuthPage);
