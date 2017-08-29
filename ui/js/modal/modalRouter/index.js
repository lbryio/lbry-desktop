import React from "react";
import { connect } from "react-redux";
import { selectCurrentModal } from "selectors/app";
import { doOpenModal } from "actions/app";
import { selectWelcomeModalAcknowledged } from "selectors/app";
import { selectUser } from "selectors/user";
import ModalRouter from "./view";
import * as modals from "constants/modal_types";

const select = (state, props) => ({
  modal: selectCurrentModal(state),
  isWelcomeAcknowledged: selectWelcomeModalAcknowledged(state),
  user: selectUser(state),
});

const perform = dispatch => ({
  openWelcomeModal: () => dispatch(doOpenModal(modals.WELCOME)),
});

export default connect(select, perform)(ModalRouter);
