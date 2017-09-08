import React from "react";
import { connect } from "react-redux";
import { doCloseModal } from "actions/app";
import { doLoadVideo } from "actions/content";
import { makeSelectMetadataForUri } from "selectors/claims";
import ModalAffirmPurchase from "./view";

const select = (state, props) => ({
  metadata: makeSelectMetadataForUri(props.uri)(state),
});

const perform = dispatch => ({
  closeModal: () => dispatch(doCloseModal()),
  loadVideo: uri => dispatch(doLoadVideo(uri)),
});

export default connect(select, perform)(ModalAffirmPurchase);
