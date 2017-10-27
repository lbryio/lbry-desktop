import React from "react";
import { connect } from "react-redux";
import { doCloseModal } from "actions/app";
import { doAbandonClaim } from "actions/content";
import ModalRevokeClaim from "./view";

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
  abandonClaim: (claimId, txid, nout) =>
    dispatch(doAbandonClaim(claimId, txid, nout)),
});

export default connect(null, perform)(ModalRevokeClaim);
