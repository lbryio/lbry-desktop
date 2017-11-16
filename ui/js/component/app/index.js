import React from "react";
import { connect } from "react-redux";
import { selectPageTitle } from "selectors/navigation";
import { selectUser } from "selectors/user";
import { doAlertError } from "actions/app";
import { doRecordScroll } from "actions/navigation";
import App from "./view";

const select = (state, props) => ({
  pageTitle: selectPageTitle(state),
  user: selectUser(state),
});

const perform = dispatch => ({
  alertError: errorList => dispatch(doAlertError(errorList)),
  recordScroll: scrollPosition => dispatch(doRecordScroll(scrollPosition)),
});

export default connect(select, perform)(App);
