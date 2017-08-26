import React from "react";
import { connect } from "react-redux";
import { selectCurrentModal, selectCurrentPage } from "selectors/app";
import { doOpenModal } from "actions/app";
import { makeSelectClientSetting } from "selectors/settings";
import { selectUser } from "selectors/user";
import { selectCostForCurrentPageUri } from "selectors/cost_info";
import * as settings from "constants/settings";
import { selectBalance } from "selectors/wallet";
import ModalRouter from "./view";

const select = (state, props) => ({
  balance: selectBalance(state),
  showPageCost: selectCostForCurrentPageUri(state),
  modal: selectCurrentModal(state),
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
