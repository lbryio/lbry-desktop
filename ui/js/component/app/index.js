import React from "react";
import { connect } from "react-redux";
import { selectKeepMedia } from "selectors/app";
import { selectPageTitle } from "selectors/navigation";
import { selectUser } from "selectors/user";
import { doCheckUpgradeAvailable, doAlertError } from "actions/app";
import { doRecordScroll } from "actions/navigation";
import { doFetchRewardedContent } from "actions/content";
import { doUpdateBalance } from "actions/wallet";
import App from "./view";

const select = (state, props) => ({
  pageTitle: selectPageTitle(state),
  user: selectUser(state),
});

const perform = dispatch => ({
  alertError: errorList => dispatch(doAlertError(errorList)),
  checkUpgradeAvailable: () => dispatch(doCheckUpgradeAvailable()),
  updateBalance: balance => dispatch(doUpdateBalance(balance)),
  fetchRewardedContent: () => dispatch(doFetchRewardedContent()),
  recordScroll: scrollPosition => dispatch(doRecordScroll(scrollPosition)),
});

export default connect(select, perform)(App);
