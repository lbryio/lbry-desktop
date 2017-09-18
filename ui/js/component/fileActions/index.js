import React from "react";
import { connect } from "react-redux";
import { makeSelectFileInfoForUri } from "selectors/file_info";
import { makeSelectCostInfoForUri } from "selectors/cost_info";
import { doOpenModal } from "actions/app";
import { makeSelectClaimIsMine } from "selectors/claims";
import FileActions from "./view";

const select = (state, props) => ({
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  /*availability check is disabled due to poor performance, TBD if it dies forever or requires daemon fix*/
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
});

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(select, perform)(FileActions);
