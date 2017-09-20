import React from "react";
import { connect } from "react-redux";
import {
  makeSelectFileInfoForUri,
  makeSelectDownloadingForUri,
  makeSelectLoadingForUri,
} from "selectors/file_info";
import { makeSelectCostInfoForUri } from "selectors/cost_info";
import { doFetchAvailability } from "actions/availability";
import { doOpenFileInShell } from "actions/file_info";
import { doPurchaseUri, doStartDownload } from "actions/content";
import FileDownloadLink from "./view";

const select = (state, props) => ({
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  /*availability check is disabled due to poor performance, TBD if it dies forever or requires daemon fix*/
  downloading: makeSelectDownloadingForUri(props.uri)(state),
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  loading: makeSelectLoadingForUri(props.uri)(state),
});

const perform = dispatch => ({
  checkAvailability: uri => dispatch(doFetchAvailability(uri)),
  openInShell: path => dispatch(doOpenFileInShell(path)),
  purchaseUri: uri => dispatch(doPurchaseUri(uri)),
  restartDownload: (uri, outpoint) => dispatch(doStartDownload(uri, outpoint)),
});

export default connect(select, perform)(FileDownloadLink);
