import React from "react";
import { doAuthNavigate } from "actions/navigation";
import { connect } from "react-redux";
import { doFetchAccessToken } from "actions/user";
import { selectAccessToken, selectUser } from "selectors/user";
import HelpPage from "./view";

const select = state => ({
  user: selectUser(state),
  accessToken: selectAccessToken(state),
});

const perform = dispatch => ({
  doAuth: () => dispatch(doAuthNavigate("/help")),
  fetchAccessToken: () => dispatch(doFetchAccessToken()),
});

export default connect(select, perform)(HelpPage);
