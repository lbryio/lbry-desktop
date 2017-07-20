import React from "react";
import { doNavigate } from "actions/app";
import { connect } from "react-redux";
import HelpPage from "./view";
import { selectUser } from "selectors/user";

const select = state => ({
  user: selectUser(state),
});

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
});

export default connect(select, perform)(HelpPage);
