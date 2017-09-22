import React from "react";
import { connect } from "react-redux";
import { doNavigate } from "actions/navigation";
import { doResolveUri } from "actions/content";
import {
  makeSelectClaimForUri,
  makeSelectMetadataForUri,
} from "selectors/claims";
import { makeSelectFileInfoForUri } from "selectors/file_info";
import { selectShowNsfw } from "selectors/settings";
import {
  makeSelectIsUriResolving,
  selectRewardContentClaimIds,
} from "selectors/content";
import FileTile from "./view";

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  obscureNsfw: !selectShowNsfw(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
  rewardedContentClaimIds: selectRewardContentClaimIds(state, props),
});

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(FileTile);
