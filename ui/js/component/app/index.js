import React from "react";
import { connect } from "react-redux";
import {
  doCheckUpgradeAvailable,
  doAlertError,
  doRecordScroll,
} from "actions/app";
import { doFetchRewardedContent } from "actions/content";
import { doUpdateBalance } from "actions/wallet";
import { selectUser } from "selectors/user";
import App from "./view";

const select = (state, props) => ({
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
