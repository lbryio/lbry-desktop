import React from "react";
import { connect } from "react-redux";
import { selectPageTitle } from "redux/selectors/navigation";
import { selectUser } from "redux/selectors/user";
import { doCheckUpgradeAvailable, doAlertError } from "redux/actions/app";
import { doRecordScroll } from "redux/actions/navigation";
import { doFetchRewardedContent } from "redux/actions/content";
import App from "./view";

const select = (state, props) => ({
  pageTitle: selectPageTitle(state),
  user: selectUser(state),
});

const perform = dispatch => ({
  alertError: errorList => dispatch(doAlertError(errorList)),
  checkUpgradeAvailable: () => dispatch(doCheckUpgradeAvailable()),
  fetchRewardedContent: () => dispatch(doFetchRewardedContent()),
  recordScroll: scrollPosition => dispatch(doRecordScroll(scrollPosition)),
});

export default connect(select, perform)(App);
