import React from "react";
import { connect } from "react-redux";
import {
  doSendDraftTransaction,
  doSetDraftTransactionAmount,
  doSetDraftTransactionAddress,
} from "actions/wallet";
import {
  selectDraftTransactionAmount,
  selectDraftTransactionAddress,
  selectDraftTransactionError,
} from "selectors/wallet";

import WalletSend from "./view";

const select = state => ({
  address: selectDraftTransactionAddress(state),
  amount: selectDraftTransactionAmount(state),
  error: selectDraftTransactionError(state),
});

const perform = dispatch => ({
  sendToAddress: () => dispatch(doSendDraftTransaction()),
  setAmount: event => dispatch(doSetDraftTransactionAmount(event.target.value)),
  setAddress: event =>
    dispatch(doSetDraftTransactionAddress(event.target.value)),
});

export default connect(select, perform)(WalletSend);
