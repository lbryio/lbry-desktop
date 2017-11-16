import React from "react";
import { doNavigate } from "redux/actions/navigation";
import { connect } from "react-redux";
import { selectPathAfterAuth } from "redux/selectors/navigation";
import {
  selectAuthenticationIsPending,
  selectEmailToVerify,
  selectUserIsVerificationCandidate,
  selectUser,
  selectUserIsPending,
  selectIdentityVerifyIsPending,
} from "redux/selectors/user";
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
