import React from "react";
import { connect } from "react-redux";
import { doCloseModal } from "redux/actions/app";
import { makeSelectMetadataForUri } from "redux/selectors/claims";
import ModalFileTimeout from "./view";

const select = state => ({
  metadata: makeSelectMetadataForUri(props.uri)(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
});

export default connect(select, perform)(ModalFileTimeout);
