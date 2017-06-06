import React from "react";
import { connect } from "react-redux";
import { doCloseModal } from "actions/app";
import {
  doSendDraftTransaction,
  doSetDraftTransactionAmount,
  doSetDraftTransactionAddress,
} from "actions/wallet";
import { selectCurrentModal } from "selectors/app";
import {
  selectDraftTransactionAmount,
  selectDraftTransactionAddress,
} from "selectors/wallet";

import WalletSend from "./view";

const select = state => ({
  modal: selectCurrentModal(state),
  address: selectDraftTransactionAddress(state),
  amount: selectDraftTransactionAmount(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
  sendToAddress: () => dispatch(doSendDraftTransaction()),
  setAmount: event => dispatch(doSetDraftTransactionAmount(event.target.value)),
  setAddress: event =>
    dispatch(doSetDraftTransactionAddress(event.target.value)),
});

export default connect(select, perform)(WalletSend);
