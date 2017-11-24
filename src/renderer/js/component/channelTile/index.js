import React from "react";
import { connect } from "react-redux";
import { makeSelectClaimForUri } from "redux/selectors/claims";
import { doNavigate } from "redux/actions/navigation";
import { doResolveUri } from "redux/actions/content";
import { makeSelectTotalItemsForChannel } from "redux/selectors/content";
import { makeSelectIsUriResolving } from "redux/selectors/content";
import ChannelTile from "./view";

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
  totalItems: makeSelectTotalItemsForChannel(props.uri)(state),
});

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(ChannelTile);
