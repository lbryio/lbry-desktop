import React from "react";
import { connect } from "react-redux";
import { doCloseModal, doNavigate } from "actions/app";
import ModalInsufficientCredits from "./view";

const select = state => ({});

const perform = dispatch => ({
  addFunds: () => {
    dispatch(doNavigate("/rewards"));
    dispatch(doCloseModal());
  },
  closeModal: () => dispatch(doCloseModal()),
});

export default connect(select, perform)(ModalInsufficientCredits);
