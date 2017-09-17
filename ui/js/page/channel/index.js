import React from "react";
import { connect } from "react-redux";
import {
  doFetchClaimsByChannel,
  doFetchClaimCountByChannel,
} from "actions/content";
import {
  makeSelectClaimForUri,
  makeSelectClaimsInChannelForCurrentPage,
  makeSelectFetchingChannelClaims,
} from "selectors/claims";
import { selectCurrentParams } from "selectors/navigation";
import { doNavigate } from "actions/navigation";
import { makeSelectTotalPagesForChannel } from "selectors/content";
import ChannelPage from "./view";

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  claimsInChannel: makeSelectClaimsInChannelForCurrentPage(
    props.uri,
    props.page
  )(state),
  fetching: makeSelectFetchingChannelClaims(props.uri)(state),
  params: selectCurrentParams(state),
  totalPages: makeSelectTotalPagesForChannel(props.uri)(state),
});

const perform = dispatch => ({
  fetchClaims: (uri, page) => dispatch(doFetchClaimsByChannel(uri, page)),
  fetchClaimCount: uri => dispatch(doFetchClaimCountByChannel(uri)),
  navigate: (path, params) => dispatch(doNavigate(path, params)),
});

export default connect(select, perform)(ChannelPage);
