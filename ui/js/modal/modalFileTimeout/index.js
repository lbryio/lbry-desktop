import React from "react";
import { connect } from "react-redux";
import { doCloseModal } from "actions/app";
import { makeSelectMetadataForUri } from "selectors/claims";
import ModalFileTimeout from "./view";

const select = state => ({
  metadata: makeSelectMetadataForUri()(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
});

export default connect(select, perform)(ModalFileTimeout);
