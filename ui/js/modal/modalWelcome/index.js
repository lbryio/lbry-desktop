import React from "react";
import * as settings from "constants/settings";
import * as modals from "constants/modal_types";
import { connect } from "react-redux";
import { doCloseModal, doOpenModal } from "actions/app";
import { doSetClientSetting } from "actions/settings";
import ModalWelcome from "./view";

const perform = dispatch => () => ({
  closeModal: () => {
    console.log("Make 'em welcome");
    dispatch(doSetClientSetting(settings.NEW_USER_ACKNOWLEDGED, true));
    dispatch(doCloseModal());
  },
});

export default connect(null, perform)(ModalWelcome);
