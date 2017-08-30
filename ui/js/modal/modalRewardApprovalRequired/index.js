import React from "react";
import { connect } from "react-redux";
import { doCloseModal, doAuthNavigate } from "actions/app";
import ModalRewardApprovalRequired from "./view";

const perform = dispatch => ({
  doAuth: () => {
    dispatch(doCloseModal());
    dispatch(doAuthNavigate());
  },
  closeModal: () => dispatch(doCloseModal()),
});

export default connect(null, perform)(ModalRewardApprovalRequired);
