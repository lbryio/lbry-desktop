import React from "react";
import { connect } from "react-redux";
import lbryuri from "lbryuri.js";
import {
  selectWunderBarAddress,
  selectWunderBarIcon,
} from "redux/selectors/search";
import { doNavigate } from "redux/actions/navigation";
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
