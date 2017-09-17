import React from "react";
import { connect } from "react-redux";
import { doSendSupport } from "actions/wallet";
import WalletSendTip from "./view";
import { makeSelectTitleForUri } from "selectors/claims";
import { selectIsSendingSupport } from "selectors/wallet";

const select = (state, props) => ({
  isPending: selectIsSendingSupport(state),
  title: makeSelectTitleForUri(props.uri)(state),
});

const perform = dispatch => ({
  sendSupport: (amount, claim_id, uri) =>
    dispatch(doSendSupport(amount, claim_id, uri)),
});

export default connect(select, perform)(WalletSendTip);
