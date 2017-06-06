import React from "react";
import { connect } from "react-redux";
import Router from "./view.jsx";
import { selectCurrentPage, selectCurrentParams } from "selectors/app.js";

const select = state => ({
  params: selectCurrentParams(state),
  currentPage: selectCurrentPage(state),
});

export default connect(select, null)(Router);
