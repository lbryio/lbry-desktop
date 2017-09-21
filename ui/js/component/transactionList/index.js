import React from "react";
import { connect } from "react-redux";
import { doNavigate } from "actions/navigation";
import { selectClaimedRewardsByTransactionId } from "selectors/rewards";
import TransactionList from "./view";

const select = state => ({
  rewards: selectClaimedRewardsByTransactionId(state),
});

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
});

export default connect(null, perform)(TransactionList);
