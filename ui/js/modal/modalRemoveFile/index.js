import React from "react";
import { connect } from "react-redux";
import { doCloseModal } from "actions/app";
import { doDeleteFileAndGoBack } from "actions/file_info";
import { makeSelectClaimForUriIsMine } from "selectors/claims";

import ModalRemoveFile from "./view";
import { makeSelectFileInfoForUri } from "../../selectors/file_info";

const select = (state, props) => ({
  claimIsMine: makeSelectClaimForUriIsMine()(state, props),
  uri: makeSelectCurrentParam("uri")(state, props),
  metadata: makeSelectMetadataForUri()(state, props),
  outpoint: makeSelectFileInfoForUri()(state, props),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
  deleteFile: (fileInfo, deleteFromComputer, abandonClaim) => {
    dispatch(doDeleteFileAndGoBack(fileInfo, deleteFromComputer, abandonClaim));
  },
});

export default connect(select, perform)(ModalRemoveFile);
