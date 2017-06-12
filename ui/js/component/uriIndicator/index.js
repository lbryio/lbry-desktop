import React from "react";
import lbryuri from "lbryuri";
import { connect } from "react-redux";
import { makeSelectIsResolvingForUri } from "selectors/content";
import { makeSelectClaimForUri } from "selectors/claims";
import UriIndicator from "./view";

const makeSelect = () => {
  const selectClaim = makeSelectClaimForUri(),
    selectIsResolving = makeSelectIsResolvingForUri();

  const select = (state, props) => ({
    claim: selectClaim(state, props),
    isResolvingUri: selectIsResolving(state, props),
    uri: lbryuri.normalize(props.uri),
  });

  return select;
};

const perform = dispatch => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(makeSelect, perform)(UriIndicator);
