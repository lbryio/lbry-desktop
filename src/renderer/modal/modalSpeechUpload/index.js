import React from "react";
import { connect } from "react-redux";
import { doCloseModal } from "redux/actions/app";
import { beginUpload } from "redux/actions/upload";
import ModalSpeechUpload from "./view";

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
  beginUpload: path => dispatch(beginUpload(path)),
});

export default connect(null, perform)(ModalSpeechUpload);
