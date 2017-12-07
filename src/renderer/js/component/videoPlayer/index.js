import React from "react";
import { connect } from "react-redux";
import { doChangeVolume } from "redux/actions/app";
import { doNavigate } from "redux/actions/navigation";
import { doSetPlayingUri, doSetTime } from "redux/actions/content";
import {
  makeSelectMetadataForUri,
  makeSelectContentTypeForUri,
} from "redux/selectors/claims";
import { selectVolume } from "redux/selectors/app";
import { makeSelectFileInfoForUri } from "redux/selectors/file_info";
import { selectCurrentTime } from "redux/selectors/content";
import VideoPlayer from "./view";

const select = (state, props) => ({
  contentType: makeSelectContentTypeForUri(props.uri)(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  currentTime: selectCurrentTime(state),
  volume: selectVolume(state),
});

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  setTime: currentTime => dispatch(doSetTime(currentTime)),
  changeVolume: volume => dispatch(doChangeVolume(volume)),
  cancelPlay: () => dispatch(doSetPlayingUri(null)),
});

export default connect(select, perform)(VideoPlayer);
