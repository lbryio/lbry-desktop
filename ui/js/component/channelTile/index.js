import React from "react";
import { connect } from "react-redux";
import { doFetchClaimCountByChannel } from "actions/content";
import { makeSelectClaimForUri } from "selectors/claims";
import { doNavigate } from "actions/navigation";
import { makeSelectTotalItemsForChannel } from "selectors/content";
import ChannelTile from "./view";

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  totalItems: makeSelectTotalItemsForChannel(props.uri)(state),
});

const perform = dispatch => ({
  fetchClaimCount: uri => dispatch(doFetchClaimCountByChannel(uri)),
  navigate: (path, params) => dispatch(doNavigate(path, params)),
});

export default connect(select, perform)(ChannelTile);
