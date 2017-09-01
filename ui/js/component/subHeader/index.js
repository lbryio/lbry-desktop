import React from "react";
import { connect } from "react-redux";
import { selectCurrentPage, selectHeaderLinks } from "selectors/navigation";
import { doNavigate } from "actions/navigation";
import SubHeader from "./view";

const select = (state, props) => ({
  currentPage: selectCurrentPage(state),
  subLinks: selectHeaderLinks(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
});

export default connect(select, perform)(SubHeader);
