import React from "react";
import rewards from "rewards";
import { connect } from "react-redux";
import { doFetchFileInfosAndPublishedClaims } from "actions/file_info";
import {
  selectFileInfosPublished,
  selectFileListDownloadedOrPublishedIsPending,
} from "selectors/file_info";
import { doClaimRewardType } from "actions/rewards";
import { doNavigate } from "actions/app";
import FileListPublished from "./view";

const select = state => ({
  fileInfos: selectFileInfosPublished(state),
  isPending: selectFileListDownloadedOrPublishedIsPending(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
  fetchFileListPublished: () => dispatch(doFetchFileInfosAndPublishedClaims()),
  claimFirstPublishReward: () =>
    dispatch(doClaimRewardType(rewards.TYPE_FIRST_PUBLISH)),
});

export default connect(select, perform)(FileListPublished);
