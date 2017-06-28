import React from "react";
import { connect } from "react-redux";
import { doNavigate } from "actions/app";
import { doResolveUri } from "actions/content";
import {
  makeSelectClaimForUri,
  makeSelectMetadataForUri,
} from "selectors/claims";
import { makeSelectFileInfoForUri } from "selectors/file_info";
import { selectShowNsfw } from "selectors/settings";
import { makeSelectIsResolvingForUri } from "selectors/content";
import FileTile from "./view";

const makeSelect = () => {
  const selectClaimForUri = makeSelectClaimForUri();
  const selectFileInfoForUri = makeSelectFileInfoForUri();
  const selectMetadataForUri = makeSelectMetadataForUri();
  const selectResolvingUri = makeSelectIsResolvingForUri();

  const select = (state, props) => ({
    claim: selectClaimForUri(state, props),
    fileInfo: selectFileInfoForUri(state, props),
    obscureNsfw: !selectShowNsfw(state),
    metadata: selectMetadataForUri(state, props),
    isResolvingUri: selectResolvingUri(state, props),
  });

  return select;
};

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(makeSelect, perform)(FileTile);
