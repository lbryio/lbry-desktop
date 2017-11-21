import React from "react";
import { connect } from "react-redux";
import {
  makeSelectClaimForUri,
  makeSelectContentTypeForUri,
  makeSelectMetadataForUri,
} from "redux/selectors/claims";
import FileDetails from "./view";
import { doOpenFileInFolder } from "redux/actions/file_info";
import { makeSelectFileInfoForUri } from "redux/selectors/file_info";

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  contentType: makeSelectContentTypeForUri(props.uri)(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
});

const perform = dispatch => ({
  openFolder: path => dispatch(doOpenFileInFolder(path)),
});

export default connect(select, perform)(FileDetails);
