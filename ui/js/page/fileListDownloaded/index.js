import React from "react";
import { connect } from "react-redux";
import { doFetchFileInfosAndPublishedClaims } from "actions/file_info";
import {
  selectFileInfosDownloaded,
  selectIsFetchingFileListDownloadedOrPublished,
} from "selectors/file_info";
import { doNavigate } from "actions/app";
import { doCancelAllResolvingUris } from "actions/content";
import FileListDownloaded from "./view";

const select = state => ({
  fileInfos: selectFileInfosDownloaded(state),
  isFetching: selectIsFetchingFileListDownloadedOrPublished(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
  fetchFileInfosDownloaded: () =>
    dispatch(doFetchFileInfosAndPublishedClaims()),
  cancelResolvingUris: () => dispatch(doCancelAllResolvingUris()),
});

export default connect(select, perform)(FileListDownloaded);
