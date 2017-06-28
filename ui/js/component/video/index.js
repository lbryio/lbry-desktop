import React from "react";
import { connect } from "react-redux";
import { doCloseModal } from "actions/app";
import { doNavigate } from "actions/app";
import { selectCurrentModal } from "selectors/app";
import { doPurchaseUri, doLoadVideo } from "actions/content";
import {
  makeSelectMetadataForUri,
  makeSelectContentTypeForUri,
} from "selectors/claims";
import {
  makeSelectFileInfoForUri,
  makeSelectLoadingForUri,
  makeSelectDownloadingForUri,
} from "selectors/file_info";
import { makeSelectCostInfoForUri } from "selectors/cost_info";
import { selectShowNsfw } from "selectors/settings";
import Video from "./view";

const makeSelect = () => {
  const selectCostInfo = makeSelectCostInfoForUri();
  const selectFileInfo = makeSelectFileInfoForUri();
  const selectIsLoading = makeSelectLoadingForUri();
  const selectIsDownloading = makeSelectDownloadingForUri();
  const selectMetadata = makeSelectMetadataForUri();
  const selectContentType = makeSelectContentTypeForUri();

  const select = (state, props) => ({
    costInfo: selectCostInfo(state, props),
    fileInfo: selectFileInfo(state, props),
    metadata: selectMetadata(state, props),
    obscureNsfw: !selectShowNsfw(state),
    modal: selectCurrentModal(state),
    isLoading: selectIsLoading(state, props),
    isDownloading: selectIsDownloading(state, props),
    contentType: selectContentType(state, props),
  });

  return select;
};

const perform = dispatch => ({
  loadVideo: uri => dispatch(doLoadVideo(uri)),
  purchaseUri: uri => dispatch(doPurchaseUri(uri, "affirmPurchaseAndPlay")),
  closeModal: () => dispatch(doCloseModal()),
});

export default connect(makeSelect, perform)(Video);
