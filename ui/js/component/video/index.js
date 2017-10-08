import React from "react";
import { connect } from "react-redux";
import { doChangeVolume } from "actions/app";
import { selectVolume } from "selectors/app";
import { doPlayUri, doSetPlayingUri } from "actions/content";
import {
  makeSelectMetadataForUri,
  makeSelectContentTypeForUri,
  makeSelectContentDurationForUri,
} from "selectors/claims";
import {
  makeSelectFileInfoForUri,
  makeSelectLoadingForUri,
  makeSelectDownloadingForUri,
} from "selectors/file_info";
import { makeSelectCostInfoForUri } from "selectors/cost_info";
import { selectShowNsfw } from "selectors/settings";
import Video from "./view";
import { selectPlayingUri } from "selectors/content";

const select = (state, props) => ({
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  obscureNsfw: !selectShowNsfw(state),
  isLoading: makeSelectLoadingForUri(props.uri)(state),
  isDownloading: makeSelectDownloadingForUri(props.uri)(state),
  playingUri: selectPlayingUri(state),
  contentType: makeSelectContentTypeForUri(props.uri)(state),
  contentDuration: makeSelectContentDurationForUri(props.uri)(state),
  volume: selectVolume(state),
});

const perform = dispatch => ({
  play: uri => dispatch(doPlayUri(uri)),
  cancelPlay: () => dispatch(doSetPlayingUri(null)),
  changeVolume: volume => dispatch(doChangeVolume(volume)),
});

export default connect(select, perform)(Video);
