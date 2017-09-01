import React from "react";
import { connect } from "react-redux";
import { doCloseModal } from "actions/app";
import { doAuthNavigate } from "actions/navigation";
import ModalRewardApprovalRequired from "./view";

const perform = dispatch => ({
  doAuth: () => {
    dispatch(doCloseModal());
    dispatch(doAuthNavigate());
  },
  closeModal: () => dispatch(doCloseModal()),
});

export default connect(null, perform)(ModalRewardApprovalRequired);
