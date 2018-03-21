import React from "react";
import { connect } from "react-redux";
import SpeechUpload from "./view";
import { doOpenModal } from "redux/actions/app";
import {
  beginSpeechUpload,
  resetSpeechUpload,
  setThumbnailStatusManual,
  setManualThumbnailUrl,
} from "redux/actions/upload";
import { selectUploadApiStatus } from "redux/selectors/upload";

const select = state => ({
  apiStatus: selectUploadApiStatus(state)
});

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  upload: (path, nsfw) => dispatch(beginSpeechUpload(path, nsfw)),
  resetUpload: () => dispatch(resetSpeechUpload()),
  setManualStatus: () => dispatch(setThumbnailStatusManual()),
  setManualUrl: url => dispatch(setManualThumbnailUrl(url)),
});

export default connect(select, perform)(SpeechUpload);
