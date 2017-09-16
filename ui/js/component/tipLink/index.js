import React from "react";
import { connect } from "react-redux";
import { doSendSupport, doHideTipBox } from "actions/claims";
import TipLink from "./view";

const select = state => ({});

const perform = dispatch => ({
  sendSupport: (amount, claim_id) => dispatch(doSendSupport(amount, claim_id)),
  hideTipBox: () => dispatch(doHideTipBox()),
});

export default connect(select, perform)(TipLink);
