import React from "react";
import { formatCredits } from "util/formatCredits";
import { connect } from "react-redux";
import {
  selectIsBackDisabled,
  selectIsForwardDisabled,
} from "redux/selectors/navigation";
import { selectBalance } from "redux/selectors/wallet";
import {
  doNavigate,
  doHistoryBack,
  doHistoryForward,
} from "redux/actions/navigation";
import Header from "./view";

const select = state => ({
  isBackDisabled: selectIsBackDisabled(state),
  isForwardDisabled: selectIsForwardDisabled(state),
  balance: formatCredits(selectBalance(state) || 0, 1),
  publish: __("Publish"),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
  back: () => dispatch(doHistoryBack()),
  forward: () => dispatch(doHistoryForward()),
});

export default connect(select, perform)(Header);
