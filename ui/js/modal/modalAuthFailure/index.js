import React from "react";
import { connect } from "react-redux";
import { doCloseModal } from "actions/app";
import ModalAuthFailure from "./view";

const select = state => ({});

const perform = dispatch => ({
  close: () => dispatch(doCloseModal()),
});

export default connect(null, null)(ModalAuthFailure);
