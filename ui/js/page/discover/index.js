import React from "react";
import { connect } from "react-redux";
import {
  doFetchFeaturedUris,
  doCancelAllResolvingUris,
  doFetchSubscriptions,
} from "actions/content";
import {
  selectFeaturedUris,
  selectFetchingFeaturedUris,
  selectSubscriptions,
} from "selectors/content";
import DiscoverPage from "./view";

const select = state => ({
  featuredUris: selectFeaturedUris(state),
  fetchingFeaturedUris: selectFetchingFeaturedUris(state),
  subscriptions: selectSubscriptions(state),
});

const perform = dispatch => ({
  fetchFeaturedUris: () => dispatch(doFetchFeaturedUris()),
  cancelResolvingUris: () => dispatch(doCancelAllResolvingUris()),
  fetchSubscriptions: () => dispatch(doFetchSubscriptions()),
});

export default connect(select, perform)(DiscoverPage);
