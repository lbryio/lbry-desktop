import React from "react";
import { connect } from "react-redux";
import { doFetchTransactions } from "actions/wallet";
import {
  selectTransactionItems,
  selectIsFetchingTransactions,
} from "selectors/wallet";
import TransactionHistoryPage from "./view";

const select = state => ({
  fetchingTransactions: selectIsFetchingTransactions(state),
  transactions: selectTransactionItems(state),
});

const perform = dispatch => ({
  fetchTransactions: () => dispatch(doFetchTransactions()),
});

export default connect(select, perform)(TransactionHistoryPage);
