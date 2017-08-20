import React from "react";
import { connect } from "react-redux";
import { doNavigate } from "actions/app";
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
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  fetchTransactions: () => dispatch(doFetchTransactions()),
});

export default connect(select, perform)(TransactionList);
