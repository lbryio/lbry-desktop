import React from 'react';
import { connect } from 'react-redux';
import PublishForm from './view';
import { selectBalance } from 'redux/selectors/wallet';
import { selectUploadUrl, selectUploadStatus } from "redux/selectors/upload";
import { doAlertError, doOpenModal } from "redux/actions/app";
import { beginSpeechUpload, resetSpeechUpload } from "redux/actions/upload";

const select = state => ({
  balance: selectBalance(state),
  uploadUrl: selectUploadUrl(state),
  uploadStatus: selectUploadStatus(state),
});

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  alertError: errorList => dispatch(doAlertError(errorList)),
  upload: (path, nsfw) => dispatch(beginSpeechUpload(path, nsfw)),
  resetUpload: () => dispatch(resetSpeechUpload()),
});

export default connect(select, perform)(PublishForm);
