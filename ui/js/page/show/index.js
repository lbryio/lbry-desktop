import React from "react";
import { connect } from "react-redux";
import { doResolveUri } from "redux/actions/content";
import { makeSelectClaimForUri } from "redux/selectors/claims";
import { makeSelectIsUriResolving } from "redux/selectors/content";
import ShowPage from "./view";

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
});

const perform = dispatch => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(ShowPage);
