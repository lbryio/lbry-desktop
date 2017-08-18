import React from "react";
import { connect } from "react-redux";
import { doNavigate } from "actions/app";
import { selectCurrentPage } from "selectors/app";
import { selectBalance } from "selectors/wallet";
import WalletPage from "./view";

const select = state => ({
  currentPage: selectCurrentPage(state),
  balance: selectBalance(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
});

export default connect(select, perform)(WalletPage);
