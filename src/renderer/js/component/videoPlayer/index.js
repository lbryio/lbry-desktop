import React from "react";
import { connect } from "react-redux";
import { doChangeVolume } from "redux/actions/app";
import { selectVolume } from "redux/selectors/app";
import { doSetPlayingUri, doSetTime } from "redux/actions/content";
import {
  makeSelectMetadataForUri,
  makeSelectContentTypeForUri,
} from "redux/selectors/claims";
import { makeSelectFileInfoForUri } from "redux/selectors/file_info";
import { selectPlayingUri, selectCurrentTime } from "redux/selectors/content";
import { selectCurrentPage } from "redux/selectors/navigation";
import VideoPlayer from "./view";

const select = (state, props) => ({
  contentType: makeSelectContentTypeForUri(props.uri)(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  currentTime: selectCurrentTime(state),
  currentPage: selectCurrentPage(state),
  playingUri: selectPlayingUri(state),
  volume: selectVolume(state),
});

const perform = dispatch => ({
  setTime: currentTime => dispatch(doSetTime(currentTime)),
  changeVolume: volume => dispatch(doChangeVolume(volume)),
  cancelPlay: () => dispatch(doSetPlayingUri(null)),
});

export default connect(select, perform)(VideoPlayer);
