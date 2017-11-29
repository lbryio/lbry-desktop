import React from "react";
import { connect } from "react-redux";
import { doCloseModal } from "redux/actions/app";
import ModalError from "./view";

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
});

export default connect(null, perform)(ModalError);
