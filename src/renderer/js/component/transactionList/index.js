import React from "react";
import { connect } from "react-redux";
import { doNavigate } from "redux/actions/navigation";
import { doOpenModal } from "redux/actions/app";
import { selectClaimedRewardsByTransactionId } from "redux/selectors/rewards";
import { selectAllMyClaimsByOutpoint } from "redux/selectors/claims";
import TransactionList from "./view";

const select = state => ({
  rewards: selectClaimedRewardsByTransactionId(state),
  myClaims: selectAllMyClaimsByOutpoint(state),
});

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(select, perform)(TransactionList);
