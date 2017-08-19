import React from "react";
import { connect } from "react-redux";
import { selectCurrentModal } from "selectors/app";
import {
  doCheckUpgradeAvailable,
  doOpenModal,
  doAlertError,
  doRecordScroll,
} from "actions/app";

import { doFetchRewardedContent } from "actions/content";
import { doUpdateBalance } from "actions/wallet";
import { doSetTheme } from "actions/settings";
import { selectWelcomeModalAcknowledged } from "selectors/app";
import { selectUser } from "selectors/user";
import App from "./view";
import * as modals from "constants/modal_types";

const select = (state, props) => ({
  modal: selectCurrentModal(state),
  isWelcomeAcknowledged: selectWelcomeModalAcknowledged(state),
  user: selectUser(state),
});

const perform = dispatch => ({
  alertError: errorList => dispatch(doAlertError(errorList)),
  checkUpgradeAvailable: () => dispatch(doCheckUpgradeAvailable()),
  openWelcomeModal: () => dispatch(doOpenModal(modals.WELCOME)),
  updateBalance: balance => dispatch(doUpdateBalance(balance)),
  fetchRewardedContent: () => dispatch(doFetchRewardedContent()),
  recordScroll: scrollPosition => dispatch(doRecordScroll(scrollPosition)),
  setTheme: name => dispatch(doSetTheme(name)),
});

export default connect(select, perform)(App);
