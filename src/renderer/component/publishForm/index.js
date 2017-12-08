import React from "react";
import { connect } from "react-redux";
import PublishForm from "./view";
import { selectBalance } from "redux/selectors/wallet";

const select = state => ({
  balance: selectBalance(state),
});

export default connect(select, null)(PublishForm);
