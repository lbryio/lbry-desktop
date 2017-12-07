import React from "react";
import * as settings from "constants/settings";
import { connect } from "react-redux";
import { doCloseModal } from "redux/actions/app";
import { doSetClientSetting } from "redux/actions/settings";
import { selectEmailToVerify, selectUser } from "redux/selectors/user";
import ModalEmailCollection from "./view";

const select = state => ({
  email: selectEmailToVerify(state),
  user: selectUser(state),
});

const perform = dispatch => () => ({
  closeModal: () => {
    dispatch(doSetClientSetting(settings.EMAIL_COLLECTION_ACKNOWLEDGED, true));
    dispatch(doCloseModal());
  },
});

export default connect(select, perform)(ModalEmailCollection);
