import React from "react";
import { connect } from "react-redux";
import { doOpenModal } from "redux/actions/app";
import * as settings from "constants/settings";
import { selectCurrentModal, selectModalProps } from "redux/selectors/app";
import { selectCurrentPage } from "redux/selectors/navigation";
import { selectCostForCurrentPageUri } from "redux/selectors/cost_info";
import { makeSelectClientSetting } from "redux/selectors/settings";
import { selectUser } from "redux/selectors/user";
import { selectBalance } from "redux/selectors/wallet";
import ModalRouter from "./view";

const select = (state, props) => ({
  balance: selectBalance(state),
  showPageCost: selectCostForCurrentPageUri(state),
  modal: selectCurrentModal(state),
  modalProps: selectModalProps(state),
  page: selectCurrentPage(state),
  isWelcomeAcknowledged: makeSelectClientSetting(
    settings.NEW_USER_ACKNOWLEDGED
  )(state),
  isCreditIntroAcknowledged: makeSelectClientSetting(
    settings.CREDIT_INTRO_ACKNOWLEDGED
  )(state),
  user: selectUser(state),
});

const perform = dispatch => ({
  openModal: modal => dispatch(doOpenModal(modal)),
});

export default connect(select, perform)(ModalRouter);
