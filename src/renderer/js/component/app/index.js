import React from "react";
import { connect } from "react-redux";
import {
  selectPageTitle,
  selectHistoryIndex,
  selectActiveHistoryEntry,
  selectCurrentPage,
} from "redux/selectors/navigation";
import { selectUser } from "redux/selectors/user";
import { doAlertError } from "redux/actions/app";
import { doRecordScroll } from "redux/actions/navigation";
import { selectPlayingUri, selectIsOverlayable } from "redux/selectors/content";
import App from "./view";

const select = (state, props) => ({
  pageTitle: selectPageTitle(state),
  user: selectUser(state),
  currentStackIndex: selectHistoryIndex(state),
  currentPageAttributes: selectActiveHistoryEntry(state),
  playingUri: selectPlayingUri(state),
  overlayable: selectIsOverlayable(state),
  currentPage: selectCurrentPage(state),
});

const perform = dispatch => ({
  alertError: errorList => dispatch(doAlertError(errorList)),
  recordScroll: scrollPosition => dispatch(doRecordScroll(scrollPosition)),
});

export default connect(select, perform)(App);
