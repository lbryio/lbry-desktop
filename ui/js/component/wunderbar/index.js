import React from "react";
import { connect } from "react-redux";
import lbryuri from "lbryuri.js";
import { selectWunderBarAddress, selectWunderBarIcon } from "selectors/search";
import { doNavigate } from "actions/app";
import Wunderbar from "./view";

const select = state => ({
  address: selectWunderBarAddress(state),
  icon: selectWunderBarIcon(state),
});

const perform = dispatch => ({
  onSearch: query => dispatch(doNavigate("/search", { query })),
  onSubmit: (query, extraParams) =>
    dispatch(
      doNavigate("/show", { uri: lbryuri.normalize(query), ...extraParams })
    ),
});

export default connect(select, perform)(Wunderbar);
