import React from "react";
import { connect } from "react-redux";
import { doStartUpgrade, doCancelUpgrade } from "redux/actions/app";
import {
  selectDownloadProgress,
  selectDownloadComplete,
} from "redux/selectors/app";
import ModalDownloading from "./view";

const select = state => ({
  downloadProgress: selectDownloadProgress(state),
  downloadComplete: selectDownloadComplete(state),
});

const perform = dispatch => ({
  startUpgrade: () => dispatch(doStartUpgrade()),
  cancelUpgrade: () => dispatch(doCancelUpgrade()),
});

export default connect(select, perform)(ModalDownloading);
