import React from "react";
import { connect } from "react-redux";
import { doFetchTransactions } from "redux/actions/wallet";
import {
  selectBalance,
  selectRecentTransactions,
  selectHasTransactions,
  selectIsFetchingTransactions,
} from "redux/selectors/wallet";

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
