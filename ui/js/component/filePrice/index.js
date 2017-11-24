import React from "react";
import { connect } from "react-redux";
import { doFetchCostInfoForUri } from "redux/actions/cost_info";
import {
  makeSelectCostInfoForUri,
  makeSelectFetchingCostInfoForUri,
} from "redux/selectors/cost_info";
import { makeSelectClaimForUri } from "redux/selectors/claims";
import FilePrice from "./view";

const select = (state, props) => ({
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  fetching: makeSelectFetchingCostInfoForUri(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri)(state),
});

const perform = dispatch => ({
  fetchCostInfo: uri => dispatch(doFetchCostInfoForUri(uri)),
  // cancelFetchCostInfo: (uri) => dispatch(doCancelFetchCostInfoForUri(uri))
});

export default connect(select, perform)(FilePrice);
