import React from "react";
import { connect } from "react-redux";
import { doFetchClaimsByChannel } from "actions/content";
import {
  makeSelectClaimForUri,
  makeSelectClaimsInChannelForCurrentPage,
  makeSelectFetchingChannelClaims,
} from "selectors/claims";
import { selectCurrentParams } from "selectors/app";
import { doNavigate } from "actions/app";
import { makeSelectTotalPagesForChannel } from "selectors/content";
import ChannelPage from "./view";

const makeSelect = () => {
  const selectClaim = makeSelectClaimForUri(),
    selectClaimsInChannel = makeSelectClaimsInChannelForCurrentPage(),
    selectFetchingChannelClaims = makeSelectFetchingChannelClaims(),
    selectTotalPagesForChannel = makeSelectTotalPagesForChannel();

  const select = (state, props) => ({
    claim: selectClaim(state, props),
    claimsInChannel: selectClaimsInChannel(state, props),
    fetching: selectFetchingChannelClaims(state, props),
    totalPages: selectTotalPagesForChannel(state, props),
    params: selectCurrentParams(state),
  });

  return select;
};

const perform = dispatch => ({
  fetchClaims: (uri, page) => dispatch(doFetchClaimsByChannel(uri, page)),
  navigate: (path, params) => dispatch(doNavigate(path, params)),
});

export default connect(makeSelect, perform)(ChannelPage);
