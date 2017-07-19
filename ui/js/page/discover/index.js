import React from "react";
import { connect } from "react-redux";
import { doFetchFeaturedUris, doCancelAllResolvingUris } from "actions/content";
import {
  selectFeaturedUris,
  selectFetchingFeaturedUris,
} from "selectors/content";
import DiscoverPage from "./view";

const select = state => ({
  featuredUris: selectFeaturedUris(state),
  fetchingFeaturedUris: selectFetchingFeaturedUris(state),
});

const perform = dispatch => ({
  fetchFeaturedUris: () => dispatch(doFetchFeaturedUris()),
  cancelResolvingUris: () => dispatch(doCancelAllResolvingUris()),
});

export default connect(select, perform)(DiscoverPage);
