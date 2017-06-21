import React from "react";
import { connect } from "react-redux";
import { doFetchCostInfoForUri } from "actions/cost_info";
import {
  makeSelectCostInfoForUri,
  makeSelectFetchingCostInfoForUri,
} from "selectors/cost_info";
import { makeSelectClaimForUri } from "selectors/claims";
import FilePrice from "./view";

const makeSelect = () => {
  const selectCostInfoForUri = makeSelectCostInfoForUri();
  const selectFetchingCostInfoForUri = makeSelectFetchingCostInfoForUri();
  const selectClaim = makeSelectClaimForUri();

  const select = (state, props) => ({
    costInfo: selectCostInfoForUri(state, props),
    fetching: selectFetchingCostInfoForUri(state, props),
    claim: selectClaim(state, props),
  });

  return select;
};

const perform = dispatch => ({
  fetchCostInfo: uri => dispatch(doFetchCostInfoForUri(uri)),
  // cancelFetchCostInfo: (uri) => dispatch(doCancelFetchCostInfoForUri(uri))
});

export default connect(makeSelect, perform)(FilePrice);
