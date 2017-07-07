import React from "react";
import { connect } from "react-redux";
import { doQuit, doSkipWrongDaemonNotice } from "actions/app";
import IncompatibleDemonModal from "./view";

const select = state => ({});

const perform = dispatch => ({
  quit: () => dispatch(doQuit()),
  skipWrongDaemonNotice: () => dispatch(doSkipWrongDaemonNotice()),
});

export default connect(select, perform)(IncompatibleDemonModal);
