import React from "react";
import { connect } from "react-redux";
import SpeechUpload from "./view";
import { doOpenModal } from "redux/actions/app";
import { beginSpeechUpload, resetSpeechUpload } from "redux/actions/upload";

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  upload: (path, nsfw) => dispatch(beginSpeechUpload(path, nsfw)),
  resetUpload: () => dispatch(resetSpeechUpload()),
});

export default connect(null, perform)(SpeechUpload);
