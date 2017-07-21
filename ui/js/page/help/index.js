import React from "react";
import { doNavigate } from "actions/app";
import { connect } from "react-redux";
import { doFetchAccessToken } from "actions/user";
import { selectAccessToken } from "selectors/user";
import HelpPage from "./view";

const select = state => ({
  accessToken: selectAccessToken(state),
});

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  fetchAccessToken: () => dispatch(doFetchAccessToken()),
});

export default connect(select, perform)(HelpPage);
