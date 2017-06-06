import React from "react";
import { connect } from "react-redux";
import { doFetchTransactions } from "actions/wallet";
import {
  selectBalance,
  selectTransactionItems,
  selectIsFetchingTransactions,
} from "selectors/wallet";

import TransactionList from "./view";

const select = state => ({
  fetchingTransactions: selectIsFetchingTransactions(state),
  transactionItems: selectTransactionItems(state),
});

const perform = dispatch => ({
  fetchTransactions: () => dispatch(doFetchTransactions()),
});

export default connect(select, perform)(TransactionList);
