import React from "react";
import { formatCredits } from "utils";
import { connect } from "react-redux";
import { selectBalance } from "selectors/wallet";
import { doNavigate, doHistoryBack, doHistoryForward } from "actions/app";
import Header from "./view";

const select = state => ({
  balance: formatCredits(selectBalance(state), 1),
  publish: __("Publish"),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
  back: () => dispatch(doHistoryBack()),
  forward: () => dispatch(doHistoryForward()),
});

export default connect(select, perform)(Header);
