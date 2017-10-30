import React from "react";
import { connect } from "react-redux";
import { doCloseModal } from "actions/app";
import { doAbandonClaim } from "actions/content";
import ModalRevokeClaim from "./view";

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
  abandonClaim: (claimId, name, txid, nout) =>
    dispatch(doAbandonClaim(claimId, name, txid, nout)),
});

export default connect(null, perform)(ModalRevokeClaim);
