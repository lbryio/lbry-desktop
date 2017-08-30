import React from "react";
import { connect } from "react-redux";
import { doRemoveSnackBarSnack } from "actions/app";
import { selectSnackBarSnacks } from "selectors/app";
import SnackBar from "./view";

const perform = dispatch => ({
  removeSnack: () => dispatch(doRemoveSnackBarSnack()),
});

const select = state => ({
  snacks: selectSnackBarSnacks(state),
});

export default connect(select, perform)(SnackBar);
