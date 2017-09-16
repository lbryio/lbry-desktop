import React from "react";
import { connect } from "react-redux";
import { selectPlatform } from "selectors/app";
import { makeSelectFileInfoForUri } from "selectors/file_info";
import { makeSelectCostInfoForUri } from "selectors/cost_info";
import { doOpenModal } from "actions/app";
import { doFetchAvailability } from "actions/availability";
import { doOpenFileInShell, doOpenFileInFolder } from "actions/file_info";
import { makeSelectClaimIsMine } from "selectors/claims";
import { doPurchaseUri, doLoadVideo, doStartDownload } from "actions/content";
import { doNavigate } from "actions/navigation";
import { doShowTipBox } from "actions/claims";
import FileActions from "./view";

const select = (state, props) => ({
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  /*availability check is disabled due to poor performance, TBD if it dies forever or requires daemon fix*/
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
});

const perform = dispatch => ({
  checkAvailability: uri => dispatch(doFetchAvailability(uri)),
  openInShell: fileInfo => dispatch(doOpenFileInShell(fileInfo)),
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  startDownload: uri => dispatch(doPurchaseUri(uri)),
  restartDownload: (uri, outpoint) => dispatch(doStartDownload(uri, outpoint)),
  editClaim: fileInfo => dispatch(doNavigate("/publish", fileInfo)),
  showTipBox: () => dispatch(doShowTipBox()),
});

export default connect(select, perform)(FileActions);
