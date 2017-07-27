import React from "react";
import { connect } from "react-redux";
import {
  doSendDraftTransaction,
  doSetDraftTransactionAmount,
  doSetDraftTransactionAddress,
} from "actions/wallet";
import TipLink from "./view";

const select = state => ({});

const perform = dispatch => ({
  sendToAddress: () => dispatch(doSendDraftTransaction()),
  setAmount: amount => dispatch(doSetDraftTransactionAmount(amount)),
  setAddress: address => dispatch(doSetDraftTransactionAddress(address)),
});

export default connect(select, perform)(TipLink);
