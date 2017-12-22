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
  openModal: (modal, props) => {
    console.log("modal:", modal);
    console.log("props:", props);
    return dispatch(doOpenModal(modal, props));
  },
  upload: path => dispatch(beginUpload(path)),
});

export default connect(select, perform)(PublishForm);
