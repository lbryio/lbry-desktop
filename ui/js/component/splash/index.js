import React from "react";
import { connect } from "react-redux";

import { selectCurrentModal, selectDaemonVersionMatched } from "selectors/app";
import { doCheckDaemonVersion } from "actions/app";
import SplashScreen from "./view";

const select = state => {
  return {
    modal: selectCurrentModal(state),
    daemonVersionMatched: selectDaemonVersionMatched(state),
  };
};

const perform = dispatch => ({
  checkDaemonVersion: () => dispatch(doCheckDaemonVersion()),
});

export default connect(select, perform)(SplashScreen);
