import React from "react";
import { connect } from "react-redux";
import { doResolveUri } from "actions/content";
import { makeSelectClaimForUri } from "selectors/claims";
import { makeSelectIsResolvingForUri } from "selectors/content";
import ShowPage from "./view";

const makeSelect = () => {
  const selectClaim = makeSelectClaimForUri(),
    selectIsResolving = makeSelectIsResolvingForUri();

  const select = (state, props) => ({
    claim: selectClaim(state, props.params),
    isResolvingUri: selectIsResolving(state, props.params),
  });

  return select;
};

const perform = dispatch => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(makeSelect, perform)(ShowPage);
