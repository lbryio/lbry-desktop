import React from "react";
import { connect } from "react-redux";
import { doNavigate } from "actions/navigation";
import { doFetchFileInfo } from "actions/file_info";
import { makeSelectFileInfoForUri } from "selectors/file_info";
import { selectRewardContentClaimIds } from "selectors/content";
import { doFetchCostInfoForUri } from "actions/cost_info";
import {
  makeSelectClaimForUri,
  makeSelectContentTypeForUri,
  makeSelectMetadataForUri,
} from "selectors/claims";
import { makeSelectCostInfoForUri } from "selectors/cost_info";
import { selectShowNsfw } from "selectors/settings";
import FilePage from "./view";
import { makeSelectCurrentParam } from "../../selectors/navigation";

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  contentType: makeSelectContentTypeForUri(props.uri)(state),
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  obscureNsfw: !selectShowNsfw(state),
  tab: makeSelectCurrentParam("tab")(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  rewardedContentClaimIds: selectRewardContentClaimIds(state, props),
});

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  fetchFileInfo: uri => dispatch(doFetchFileInfo(uri)),
  fetchCostInfo: uri => dispatch(doFetchCostInfoForUri(uri)),
});

export default connect(select, perform)(FilePage);
