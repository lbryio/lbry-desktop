import React from "react";
import { connect } from "react-redux";
import { doCloseModal } from "actions/app";
import { doChangeVolume } from "actions/app";
import { selectCurrentModal, selectVolume } from "selectors/app";
import { doPurchaseUri, doLoadVideo } from "actions/content";
import {
  makeSelectMetadataForUri,
  makeSelectContentTypeForUri,
} from "selectors/claims";
import {
  makeSelectFileInfoForUri,
  makeSelectLoadingForUri,
  makeSelectDownloadingForUri,
} from "selectors/file_info";
import { makeSelectCostInfoForUri } from "selectors/cost_info";
import { selectShowNsfw } from "selectors/settings";
import Video from "./view";

const select = (state, props) => ({
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  obscureNsfw: !selectShowNsfw(state),
  isLoading: makeSelectLoadingForUri(props.uri)(state),
  isDownloading: makeSelectDownloadingForUri(props.uri)(state),
  contentType: makeSelectContentTypeForUri(props.uri)(state),
  volume: selectVolume(state),
});

const perform = dispatch => ({
  loadVideo: uri => dispatch(doLoadVideo(uri)),
  purchaseUri: uri => dispatch(doPurchaseUri(uri)),
  changeVolume: volume => dispatch(doChangeVolume(volume)),
});

export default connect(select, perform)(Video);
