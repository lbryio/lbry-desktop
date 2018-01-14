import React from "react";
import { connect } from "react-redux";
import PublishForm from "./view";
import { selectBalance } from "redux/selectors/wallet";
import { selectUploadUrl, selectUploadStatus } from "redux/selectors/upload";
import { doOpenModal } from "redux/actions/app";
import { beginUpload } from "redux/actions/upload";

const select = state => ({
  balance: selectBalance(state),
  uploadUrl: selectUploadUrl(state),
  uploadStatus: selectUploadStatus(state),
});

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  upload: (path, nsfw) => dispatch(beginUpload(path, nsfw)),
});

export default connect(select, perform)(PublishForm);
