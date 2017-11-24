import React from "react";
import { connect } from "react-redux";
import { doFetchFileInfosAndPublishedClaims } from "redux/actions/file_info";
import {
  selectFileInfosDownloaded,
  selectIsFetchingFileListDownloadedOrPublished,
} from "redux/selectors/file_info";
import {
  selectMyClaimsWithoutChannels,
  selectIsFetchingClaimListMine,
} from "redux/selectors/claims";
import { doFetchClaimListMine } from "redux/actions/content";
import { doNavigate } from "redux/actions/navigation";
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
  fetchClaims: () => dispatch(doFetchClaimListMine()),
});

export default connect(select, perform)(FileListDownloaded);
