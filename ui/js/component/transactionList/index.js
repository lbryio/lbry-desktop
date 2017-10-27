import React from "react";
import { connect } from "react-redux";
import { doNavigate } from "actions/navigation";
import { doOpenModal } from "actions/app";
import { doResolveUri } from "actions/content";
import { selectClaimedRewardsByTransactionId } from "selectors/rewards";
import { selectAllMyClaimsByTxidNout } from "selectors/claims";
import { selectResolvingUris } from "selectors/content";
import TransactionList from "./view";

const select = state => ({
  rewards: selectClaimedRewardsByTransactionId(state),
  myClaims: selectAllMyClaimsByTxidNout(state),
});

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  resolveUri: uri => dispatch(doResolveUri(uri)),
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(select, perform)(TransactionList);
