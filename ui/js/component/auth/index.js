import React from "react";
import { connect } from "react-redux";
import {
  selectAuthenticationIsPending,
  selectEmailToVerify,
  selectUserIsVerificationCandidate,
} from "selectors/user";
import Auth from "./view";

const select = state => ({
  isPending: selectAuthenticationIsPending(state),
  email: selectEmailToVerify(state),
  isVerificationCandidate: selectUserIsVerificationCandidate(state),
});

export default connect(select, null)(Auth);
