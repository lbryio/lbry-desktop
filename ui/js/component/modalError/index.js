import React from "react";
import { connect } from "react-redux";
import { selectCurrentModal, selectModalExtraContent } from "selectors/app";
import { doCloseModal } from "actions/app";
import ModalError from "./view";

const select = state => ({
  modal: selectCurrentModal(state),
  error: selectModalExtraContent(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
});

export default connect(select, perform)(ModalError);
