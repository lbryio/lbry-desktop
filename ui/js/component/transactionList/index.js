import React from "react";
import { connect } from "react-redux";
import { doNavigate } from "actions/navigation";
import TransactionList from "./view";

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
});

export default connect(null, perform)(TransactionList);
