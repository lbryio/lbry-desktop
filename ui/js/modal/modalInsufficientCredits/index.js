import React from "react";
import { connect } from "react-redux";
import { doCloseModal } from "actions/app";
import { doNavigate } from "actions/navigation";
import ModalInsufficientCredits from "./view";

const select = state => ({});

const perform = dispatch => ({
  addFunds: () => {
    dispatch(doNavigate("/wallet"));
    dispatch(doCloseModal());
  },
  closeModal: () => dispatch(doCloseModal()),
});

export default connect(select, perform)(ModalInsufficientCredits);
