import React from "react";
import { connect } from "react-redux";
import { doCloseModal } from "redux/actions/app";
import { doLoadVideo, doSetPlayingUri } from "redux/actions/content";
import { makeSelectMetadataForUri } from "redux/selectors/claims";
import ModalAffirmPurchase from "./view";

const select = (state, props) => ({
  metadata: makeSelectMetadataForUri(props.uri)(state),
});

const perform = dispatch => ({
  cancelPurchase: () => {
    dispatch(doSetPlayingUri(null));
    dispatch(doCloseModal());
  },
  closeModal: () => dispatch(doCloseModal()),
  loadVideo: uri => dispatch(doLoadVideo(uri)),
});

export default connect(select, perform)(ModalAffirmPurchase);
