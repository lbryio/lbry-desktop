import React from "react";
import { connect } from "react-redux";
import {
  doSendSupport,
  doSetSupportAmount,
  doSetSupportClaimID,
} from "actions/claims";
import TipLink from "./view";

const select = state => ({});

const perform = dispatch => ({
  sendSupport: () => dispatch(doSendSupport()),
  setAmount: amount => dispatch(doSetSupportAmount(amount)),
  setClaimID: claim_id => dispatch(doSetSupportClaimID(claim_id)),
});

export default connect(select, perform)(TipLink);
