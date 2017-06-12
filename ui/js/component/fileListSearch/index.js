import React from "react";
import { connect } from "react-redux";
import { doSearch } from "actions/search";
import {
  selectIsSearching,
  selectCurrentSearchResults,
  selectSearchQuery,
} from "selectors/search";
import { doNavigate } from "actions/app";
import FileListSearch from "./view";

const select = state => ({
  isSearching: selectIsSearching(state),
  query: selectSearchQuery(state),
  results: selectCurrentSearchResults(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
  search: search => dispatch(doSearch(search)),
});

export default connect(select, perform)(FileListSearch);
