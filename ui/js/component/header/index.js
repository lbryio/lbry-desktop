import React from "react";
import { formatCredits } from "util/formatCredits";
import { connect } from "react-redux";
import {
  selectIsBackDisabled,
  selectIsForwardDisabled,
} from "selectors/navigation";
import { selectBalance } from "selectors/wallet";
import {
  doNavigate,
  doHistoryBack,
  doHistoryForward,
} from "actions/navigation";
import { doDownloadUpgrade } from "actions/app";
import Header from "./view";

const select = state => ({
  isBackDisabled: selectIsBackDisabled(state),
  isForwardDisabled: selectIsForwardDisabled(state),
  balance: formatCredits(selectBalance(state) || 0, 1),
  publish: __("Publish"),
  upgrade: __("Upgrade"),
  upgradeSkipped: true,
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
  back: () => dispatch(doHistoryBack()),
  forward: () => dispatch(doHistoryForward()),
  downloadUpgrade: () => dispatch(doDownloadUpgrade()),
});

export default connect(select, perform)(Header);
