import React from "react";
import { connect } from "react-redux";
import { doCloseModal } from "redux/actions/app";
import { doDeleteFileAndGoBack } from "redux/actions/file_info";
import {
  makeSelectTitleForUri,
  makeSelectClaimIsMine,
} from "redux/selectors/claims";
import { makeSelectFileInfoForUri } from "redux/selectors/file_info";
import ModalRemoveFile from "./view";

const select = (state, props) => ({
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  title: makeSelectTitleForUri(props.uri)(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
  deleteFile: (fileInfo, deleteFromComputer, abandonClaim) => {
    dispatch(doDeleteFileAndGoBack(fileInfo, deleteFromComputer, abandonClaim));
  },
});

export default connect(select, perform)(ModalRemoveFile);
