import React from "react";
import { connect } from "react-redux";
import { doSendSupport } from "actions/claims";
import TipLink from "./view";

const select = state => ({});

const perform = dispatch => ({
  sendSupport: (amount, claim_id) => dispatch(doSendSupport(amount, claim_id)),
});

export default connect(select, perform)(TipLink);
