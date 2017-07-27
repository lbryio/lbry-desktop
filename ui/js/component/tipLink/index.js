import React from "react";
import { connect } from "react-redux";
import {
  doSendDraftTransaction,
  doSetDraftTransactionAmount,
  doSetDraftTransactionAddress,
} from "actions/wallet";
import { selectCurrentModal } from "selectors/app";
import { doCloseModal, doOpenModal } from "actions/app";
import TipLink from "./view";

const makeSelect = () => {
  const select = (state, props) => ({
    modal: selectCurrentModal(state),
  });

  return select;
};

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
  openModal: modal => dispatch(doOpenModal(modal)),
  sendToAddress: () => dispatch(doSendDraftTransaction()),
  setAmount: amount => dispatch(doSetDraftTransactionAmount(amount)),
  setAddress: address => dispatch(doSetDraftTransactionAddress(address)),
});

export default connect(makeSelect, perform)(TipLink);
