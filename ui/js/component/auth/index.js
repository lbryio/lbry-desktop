import React from "react";
import { connect } from "react-redux";
import {
  selectAuthenticationIsPending,
  selectEmailToVerify,
  selectUserIsVerificationCandidate,
  selectUser,
} from "selectors/user";
import Auth from "./view";

const select = state => ({
  isPending: selectAuthenticationIsPending(state),
  email: selectEmailToVerify(state),
  user: selectUser(state),
  isVerificationCandidate: selectUserIsVerificationCandidate(state),
});

export default connect(select, null)(Auth);
