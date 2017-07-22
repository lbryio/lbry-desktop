import React from "react";
import { connect } from "react-redux";
import { doQuit, doSkipWrongDaemonNotice } from "actions/app";
import { doLaunchDaemonHelp } from "actions/app";
import ModalIncompatibleDaemon from "./view";

const select = state => ({});

const perform = dispatch => ({
  quit: () => dispatch(doQuit()),
  launchDaemonHelp: () => dispatch(doLaunchDaemonHelp()),
});

export default connect(select, perform)(ModalIncompatibleDaemon);
