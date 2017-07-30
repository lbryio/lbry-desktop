import React from "react";
import { connect } from "react-redux";
import { selectPlatform } from "selectors/app";
import {
  makeSelectFileInfoForUri,
  makeSelectDownloadingForUri,
  makeSelectLoadingForUri,
} from "selectors/file_info";

import { makeSelectIsAvailableForUri } from "selectors/availability";
import { selectCurrentModal } from "selectors/app";
import { makeSelectCostInfoForUri } from "selectors/cost_info";
import { doCloseModal, doOpenModal } from "actions/app";
import { doFetchAvailability } from "actions/availability";
import { doOpenFileInShell, doOpenFileInFolder } from "actions/file_info";
import { makeSelectClaimForUriIsMine } from "selectors/claims";
import { doPurchaseUri, doLoadVideo, doStartDownload } from "actions/content";
import FileActions from "./view";
import { makeSelectClaimForUri } from "selectors/claims";
import {
  doClaimNewSupport,
  doSetClaimSupportAmount,
  doSetClaimSupportClaim,
} from "actions/claims";
import { selectClaimSupportAmount } from "selectors/claims";

const makeSelect = () => {
  const selectClaim = makeSelectClaimForUri();
  const selectFileInfoForUri = makeSelectFileInfoForUri();
  const selectIsAvailableForUri = makeSelectIsAvailableForUri();
  const selectDownloadingForUri = makeSelectDownloadingForUri();
  const selectCostInfoForUri = makeSelectCostInfoForUri();
  const selectLoadingForUri = makeSelectLoadingForUri();
  const selectClaimForUriIsMine = makeSelectClaimForUriIsMine();

  const select = (state, props) => ({
    claim: selectClaim(state, props),
    fileInfo: selectFileInfoForUri(state, props),
    /*availability check is disabled due to poor performance, TBD if it dies forever or requires daemon fix*/
    isAvailable: true, //selectIsAvailableForUri(state, props),
    platform: selectPlatform(state),
    modal: selectCurrentModal(state),
    downloading: selectDownloadingForUri(state, props),
    costInfo: selectCostInfoForUri(state, props),
    loading: selectLoadingForUri(state, props),
    claimIsMine: selectClaimForUriIsMine(state, props),
    amount: selectClaimSupportAmount(state),
  });

  return select;
};

const perform = dispatch => ({
  checkAvailability: uri => dispatch(doFetchAvailability(uri)),
  closeModal: () => dispatch(doCloseModal()),
  openInFolder: fileInfo => dispatch(doOpenFileInFolder(fileInfo)),
  openInShell: fileInfo => dispatch(doOpenFileInShell(fileInfo)),
  openModal: modal => dispatch(doOpenModal(modal)),
  startDownload: uri => dispatch(doPurchaseUri(uri, "affirmPurchase")),
  loadVideo: uri => dispatch(doLoadVideo(uri)),
  restartDownload: (uri, outpoint) => dispatch(doStartDownload(uri, outpoint)),
  claimNewSupport: () => dispatch(doClaimNewSupport()),
  setAmount: event => dispatch(doSetClaimSupportAmount(event.target.value)),
  setClaimSupport: (claim_id, name) =>
    dispatch(doSetClaimSupportClaim(claim_id, name)),
});

export default connect(makeSelect, perform)(FileActions);
