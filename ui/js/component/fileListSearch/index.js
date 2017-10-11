import React from "react";
import { connect } from "react-redux";
import { doSearch } from "actions/search";
import { selectIsSearching, makeSelectSearchUris } from "selectors/search";
import FileListSearch from "./view";

const select = (state, props) => ({
  isSearching: selectIsSearching(state),
  uris: makeSelectSearchUris(props.query)(state),
});

const perform = dispatch => ({
  search: search => dispatch(doSearch(search)),
});

export default connect(select, perform)(FileListSearch);
