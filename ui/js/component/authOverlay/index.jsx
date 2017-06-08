import React from "react";
import * as modal from "constants/modal_types";
import { connect } from "react-redux";
import { doUserEmailDecline } from "actions/user";
import { doOpenModal } from "actions/app";
import {
  selectAuthenticationIsPending,
  selectUserIsAuthRequested,
} from "selectors/user";
import AuthOverlay from "./view";

const select = state => ({
  isPending: selectAuthenticationIsPending(state),
  isShowing: selectUserIsAuthRequested(state),
});

const perform = dispatch => ({
  userEmailDecline: () => dispatch(doUserEmailDecline()),
  openWelcomeModal: () => dispatch(doOpenModal(modal.WELCOME)),
});

export default connect(select, perform)(AuthOverlay);
