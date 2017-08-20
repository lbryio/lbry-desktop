import React from "react";
import { connect } from "react-redux";
import { doFetchTransactions } from "actions/wallet";
import {
  selectBalance,
  selectRecentTransactions,
  selectHasTransactions,
  selectIsFetchingTransactions,
} from "selectors/wallet";

import TransactionListRecent from "./view";

const select = state => ({
  fetchingTransactions: selectIsFetchingTransactions(state),
  transactions: selectRecentTransactions(state),
  hasTransactions: selectHasTransactions(state),
});

const perform = dispatch => ({
  fetchTransactions: () => dispatch(doFetchTransactions()),
});

export default connect(select, perform)(TransactionListRecent);
