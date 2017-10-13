import React from "react";
import { connect } from "react-redux";
import { makeSelectClaimForUri } from "selectors/claims";
import { doNavigate } from "actions/navigation";
import { doResolveUri } from "actions/content";
import { makeSelectTotalItemsForChannel } from "selectors/content";
import { makeSelectIsUriResolving } from "selectors/content";
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
