import React from "react";
import { connect } from "react-redux";
import { doHistoryBackCompleted } from "actions/app";
import { doFetchFeaturedUris, doCancelAllResolvingUris } from "actions/content";
import {
  selectFeaturedUris,
  selectFetchingFeaturedUris,
} from "selectors/content";
import { selectNavigatingBack } from "selectors/app";
import DiscoverPage from "./view";

const select = state => ({
  featuredUris: selectFeaturedUris(state),
  fetchingFeaturedUris: selectFetchingFeaturedUris(state),
  isNavigatingBack: selectNavigatingBack(state),
});

const perform = dispatch => ({
  fetchFeaturedUris: () => dispatch(doFetchFeaturedUris()),
  cancelResolvingUris: () => dispatch(doCancelAllResolvingUris()),
  finishedNavigatingBack: () => dispatch(doHistoryBackCompleted()),
});

export default connect(select, perform)(DiscoverPage);
