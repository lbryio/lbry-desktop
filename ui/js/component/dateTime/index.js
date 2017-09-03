import React from "react";
import { connect } from "react-redux";
import { makeSelectBlockDate } from "selectors/wallet";
import { doFetchBlock } from "actions/wallet";
import DateTime from "./view";

const select = (state, props) => ({
  date: !props.date && props.block
    ? makeSelectBlockDate(props.block)(state)
    : props.date,
});

const perform = dispatch => ({
  fetchBlock: height => dispatch(doFetchBlock(height)),
});

export default connect(select, perform)(DateTime);
