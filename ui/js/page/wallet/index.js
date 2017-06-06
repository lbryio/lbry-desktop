import React from "react";
import { connect } from "react-redux";
import { selectCurrentPage } from "selectors/app";
import { selectBalance } from "selectors/wallet";
import WalletPage from "./view";

const select = state => ({
  currentPage: selectCurrentPage(state),
  balance: selectBalance(state),
});

export default connect(select, null)(WalletPage);
