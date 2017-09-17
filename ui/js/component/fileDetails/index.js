import React from "react";
import { connect } from "react-redux";
import {
  makeSelectClaimForUri,
  makeSelectContentTypeForUri,
  makeSelectMetadataForUri,
} from "selectors/claims";
import FileDetails from "./view";

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  contentType: makeSelectContentTypeForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
});

export default connect(select, null)(FileDetails);
