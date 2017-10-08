import React from "react";
import { connect } from "react-redux";
import {
  makeSelectClaimForUri,
  makeSelectContentTypeForUri,
  makeSelectContentDurationForUri,
  makeSelectMetadataForUri,
} from "selectors/claims";
import FileDetails from "./view";
import { doOpenFileInFolder } from "actions/file_info";
import { makeSelectFileInfoForUri } from "selectors/file_info";

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  contentType: makeSelectContentTypeForUri(props.uri)(state),
  contentDuration: makeSelectContentDurationForUri(props.uri)(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
});

const perform = dispatch => ({
  openFolder: path => dispatch(doOpenFileInFolder(path)),
});

export default connect(select, perform)(FileDetails);
