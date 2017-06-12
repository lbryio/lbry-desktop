import React from "react";
import { connect } from "react-redux";
import { doUserEmailNew } from "actions/user";
import {
  selectEmailNewIsPending,
  selectEmailNewErrorMessage,
} from "selectors/user";
import UserEmailNew from "./view";

const select = state => ({
  isPending: selectEmailNewIsPending(state),
  errorMessage: selectEmailNewErrorMessage(state),
});

const perform = dispatch => ({
  addUserEmail: email => dispatch(doUserEmailNew(email)),
});

export default connect(select, perform)(UserEmailNew);
