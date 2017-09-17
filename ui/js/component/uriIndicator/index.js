import React from "react";
import lbryuri from "lbryuri";
import { connect } from "react-redux";
import { doResolveUri } from "actions/content";
import { makeSelectIsUriResolving } from "selectors/content";
import { makeSelectClaimForUri } from "selectors/claims";
import UriIndicator from "./view";

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
  uri: lbryuri.normalize(props.uri),
});

const perform = dispatch => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(UriIndicator);
