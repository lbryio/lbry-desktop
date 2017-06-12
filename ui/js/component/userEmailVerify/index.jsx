import React from "react";
import { connect } from "react-redux";
import { doUserEmailVerify } from "actions/user";
import {
  selectEmailVerifyIsPending,
  selectEmailToVerify,
  selectEmailVerifyErrorMessage,
} from "selectors/user";
import UserEmailVerify from "./view";

const select = state => ({
  isPending: selectEmailVerifyIsPending(state),
  email: selectEmailToVerify(state),
  errorMessage: selectEmailVerifyErrorMessage(state),
});

const perform = dispatch => ({
  verifyUserEmail: code => dispatch(doUserEmailVerify(code)),
});

export default connect(select, perform)(UserEmailVerify);
