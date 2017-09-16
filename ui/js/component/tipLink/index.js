import React from "react";
import { connect } from "react-redux";
import { doSendSupport } from "actions/claims";
import TipLink from "./view";
import * as types from "constants/action_types";

const select = state => ({});

const perform = dispatch => ({
  sendSupport: (amount, claim_id) => dispatch(doSendSupport(amount, claim_id)),
  hideTipBox: () => dispatch({ type: types.HIDE_TIP_BOX }),
});

export default connect(select, perform)(TipLink);
