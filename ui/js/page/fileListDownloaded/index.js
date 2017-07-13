import React from "react";
import { connect } from "react-redux";
import { doFetchFileInfosAndPublishedClaims } from "actions/file_info";
import {
  selectFileInfosDownloaded,
  selectIsFetchingFileListDownloadedOrPublished,
} from "selectors/file_info";
import {
  selectMyClaimsWithoutChannels,
  selectIsFetchingClaimListMine,
} from "selectors/claims";
import { doFetchClaimListMine } from "actions/content";
import { doNavigate } from "actions/app";
import { doCancelAllResolvingUris } from "actions/content";
import FileListDownloaded from "./view";

const select = state => ({
  fileInfos: selectFileInfosDownloaded(state),
  isFetching: selectIsFetchingFileListDownloadedOrPublished(state),
  claims: selectMyClaimsWithoutChannels(state),
  isFetchingClaims: selectIsFetchingClaimListMine(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
  fetchFileInfosDownloaded: () =>
    dispatch(doFetchFileInfosAndPublishedClaims()),
  cancelResolvingUris: () => dispatch(doCancelAllResolvingUris()),
  fetchClaims: () => dispatch(doFetchClaimListMine()),
});

export default connect(select, perform)(FileListDownloaded);
