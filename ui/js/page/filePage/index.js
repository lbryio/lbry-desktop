import React from "react";
import { connect } from "react-redux";
import { doNavigate } from "actions/app";
import { doFetchFileInfo } from "actions/file_info";
import { makeSelectFileInfoForUri } from "selectors/file_info";
import { doFetchCostInfoForUri } from "actions/cost_info";
import {
  makeSelectClaimForUri,
  makeSelectContentTypeForUri,
  makeSelectMetadataForUri,
} from "selectors/claims";
import { makeSelectCostInfoForUri } from "selectors/cost_info";
import { selectShowNsfw } from "selectors/settings";
import FilePage from "./view";

const makeSelect = () => {
  const selectClaim = makeSelectClaimForUri(),
    selectContentType = makeSelectContentTypeForUri(),
    selectFileInfo = makeSelectFileInfoForUri(),
    selectCostInfo = makeSelectCostInfoForUri(),
    selectMetadata = makeSelectMetadataForUri();

  const select = (state, props) => ({
    claim: selectClaim(state, props),
    contentType: selectContentType(state, props),
    costInfo: selectCostInfo(state, props),
    metadata: selectMetadata(state, props),
    showNsfw: !selectShowNsfw(state),
    fileInfo: selectFileInfo(state, props),
  });

  return select;
};

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  fetchFileInfo: uri => dispatch(doFetchFileInfo(uri)),
  fetchCostInfo: uri => dispatch(doFetchCostInfoForUri(uri)),
});

export default connect(makeSelect, perform)(FilePage);
