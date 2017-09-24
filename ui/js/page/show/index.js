import React from "react";
import { connect } from "react-redux";
import { doOpenOverlayMedia } from "actions/app.js";
import { doResolveUri } from "actions/content";
import { makeSelectClaimForUri } from "selectors/claims";
import { makeSelectIsUriResolving } from "selectors/content";
import ShowPage from "./view";

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
});

const perform = dispatch => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
  openMedia: () => dispatch(doOpenOverlayMedia()),
});

export default connect(select, perform)(ShowPage);
