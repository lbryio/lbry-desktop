import React from "react";
import { connect } from "react-redux";
import { doExpandOverlayMedia, doMinimizeOverlayMedia } from "actions/app.js";
import { selectMediaExpand, selectKeepPlaying } from "selectors/app.js";
import { selectPlayingUri } from "selectors/content";
import {
  selectCurrentPage,
  selectCurrentParams,
} from "selectors/navigation.js";
import OverlayRouter from "./view.jsx";

const select = state => ({
  params: selectCurrentParams(state),
  currentPage: selectCurrentPage(state),
  mediaExpand: selectMediaExpand(state),
  playingUri: selectPlayingUri(state),
  keepPlaying: selectKeepPlaying(state),
});

const perform = dispatch => ({
  expandMedia: () => dispatch(doExpandOverlayMedia()),
  minimizeMedia: () => dispatch(doMinimizeOverlayMedia()),
});

export default connect(select, perform)(OverlayRouter);
