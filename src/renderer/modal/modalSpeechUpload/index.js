import React from "react";
import { connect } from "react-redux";
import { doCloseModal } from "redux/actions/app";
import { beginSpeechUpload, resetSpeechUpload } from "redux/actions/upload";
import ModalSpeechUpload from "./view";

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
  resetUpload: () => dispatch(resetSpeechUpload()),
  beginUpload: path => dispatch(beginSpeechUpload(path)),
});

export default connect(null, perform)(ModalSpeechUpload);
