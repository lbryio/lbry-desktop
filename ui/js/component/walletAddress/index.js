import React from "react";
import { connect } from "react-redux";
import { doCheckAddressIsMine, doGetNewAddress } from "actions/wallet";
import {
  selectReceiveAddress,
  selectGettingNewAddress,
} from "selectors/wallet";
import WalletPage from "./view";

const select = state => ({
  receiveAddress: selectReceiveAddress(state),
  gettingNewAddress: selectGettingNewAddress(state),
});

const perform = dispatch => ({
  checkAddressIsMine: address => dispatch(doCheckAddressIsMine(address)),
  getNewAddress: () => dispatch(doGetNewAddress()),
});

export default connect(select, perform)(WalletPage);
