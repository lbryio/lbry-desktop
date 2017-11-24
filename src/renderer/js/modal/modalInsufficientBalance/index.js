import React from "react";
import { connect } from "react-redux";
import { doCloseModal } from "redux/actions/app";
import { doNavigate } from "redux/actions/navigation";
import ModalInsufficientBalance from "./view";

const select = state => ({});

const perform = dispatch => ({
  addBalance: () => {
    dispatch(doNavigate("/wallet"));
    dispatch(doCloseModal());
  },
  closeModal: () => dispatch(doCloseModal()),
});

export default connect(select, perform)(ModalInsufficientBalance);
