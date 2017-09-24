import React from "react";
import { connect } from "react-redux";
import { selectKeepPlaying } from "selectors/app.js";
import { selectPlayingUri } from "selectors/content";
import {
  selectCurrentPage,
  selectCurrentParams,
} from "selectors/navigation.js";
import OverlayRouter from "./view.jsx";

const select = state => ({
  params: selectCurrentParams(state),
  currentPage: selectCurrentPage(state),
  playingUri: selectPlayingUri(state),
  keepPlaying: selectKeepPlaying(state),
});

export default connect(select, null)(OverlayRouter);
