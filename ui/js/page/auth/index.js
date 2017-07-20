import React from "react";
import { doNavigate } from "actions/app";
import { connect } from "react-redux";
import { selectPathAfterAuth } from "selectors/app";
import {
  selectAuthenticationIsPending,
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
  pathAfterAuth: selectPathAfterAuth(state),
  user: selectUser(state),
  isVerificationCandidate: selectUserIsVerificationCandidate(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
});

export default connect(select, perform)(AuthPage);
