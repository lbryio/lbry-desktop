import React from "react";
import { connect } from "react-redux";
import { doQuit, doSkipWrongDaemonNotice } from "actions/app";
import ModalIncompatibleDaemon from "./view";

const select = state => ({});

const perform = dispatch => ({
  quit: () => dispatch(doQuit()),
});

export default connect(select, perform)(ModalIncompatibleDaemon);
