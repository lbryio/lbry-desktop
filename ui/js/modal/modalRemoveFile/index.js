import React from "react";
import { connect } from "react-redux";
import { doCloseModal } from "actions/app";
import { doDeleteFileAndGoBack } from "actions/file_info";
import { makeSelectTitleForUri, makeSelectClaimIsMine } from "selectors/claims";
import { makeSelectFileInfoForUri } from "selectors/file_info";
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
