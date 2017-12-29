import React from "react";
import { connect } from "react-redux";
import { doChangeVolume } from "redux/actions/app";
import { selectVolume } from "redux/selectors/app";
import { doPlayUri, doSetPlayingUri } from "redux/actions/content";
import { doPlay, doPause, savePosition } from "redux/actions/media";
import {
  makeSelectMetadataForUri,
  makeSelectContentTypeForUri,
} from "redux/selectors/claims";
import {
  makeSelectFileInfoForUri,
  makeSelectLoadingForUri,
  makeSelectDownloadingForUri,
} from "redux/selectors/file_info";
import { makeSelectCostInfoForUri } from "redux/selectors/cost_info";
import { selectShowNsfw } from "redux/selectors/settings";
import {
  selectMediaPaused,
  makeSelectMediaPositionForUri,
} from "redux/selectors/media";
import Video from "./view";
import { selectPlayingUri } from "redux/selectors/content";
import { makeSelectClaimForUri } from "redux/selectors/claims";

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  obscureNsfw: !selectShowNsfw(state),
  isLoading: makeSelectLoadingForUri(props.uri)(state),
  isDownloading: makeSelectDownloadingForUri(props.uri)(state),
  playingUri: selectPlayingUri(state),
  contentType: makeSelectContentTypeForUri(props.uri)(state),
  volume: selectVolume(state),
  mediaPaused: selectMediaPaused(state),
  mediaPosition: makeSelectMediaPositionForUri(props.uri)(state),
});

const perform = dispatch => ({
  play: uri => dispatch(doPlayUri(uri)),
  cancelPlay: () => dispatch(doSetPlayingUri(null)),
  changeVolume: volume => dispatch(doChangeVolume(volume)),
  doPlay: () => dispatch(doPlay()),
  doPause: () => dispatch(doPause()),
  savePosition: (id, position) => dispatch(savePosition(id, position)),
});

export default connect(select, perform)(Video);
