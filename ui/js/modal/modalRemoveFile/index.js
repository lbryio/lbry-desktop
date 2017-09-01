import React from "react";
import { connect } from "react-redux";
import { doCloseModal } from "actions/app";
import { doDeleteFileAndGoBack } from "actions/file_info";
import { makeSelectClaimForUriIsMine } from "selectors/claims";

import ModalRemoveFile from "./view";

const makeSelect = () => {
  const selectClaimForUriIsMine = makeSelectClaimForUriIsMine();

  const select = (state, props) => ({
    claimIsMine: selectClaimForUriIsMine(state, props),
  });

  return select;
};

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
  deleteFile: (fileInfo, deleteFromComputer, abandonClaim) => {
    dispatch(doDeleteFileAndGoBack(fileInfo, deleteFromComputer, abandonClaim));
  },
});

export default connect(makeSelect, perform)(ModalRemoveFile);
