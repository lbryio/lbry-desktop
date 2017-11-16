import React from "react";
import { connect } from "react-redux";
import { doCloseModal } from "redux/actions/app";
import { doAbandonClaim } from "redux/actions/content";
import { selectTransactionItems } from "redux/selectors/wallet";
import ModalRevokeClaim from "./view";

const select = state => ({
  transactionItems: selectTransactionItems(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
  abandonClaim: (txid, nout) => dispatch(doAbandonClaim(txid, nout)),
});

export default connect(select, perform)(ModalRevokeClaim);
