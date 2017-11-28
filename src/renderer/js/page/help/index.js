import React from "react";
import { doAuthNavigate } from "redux/actions/navigation";
import { connect } from "react-redux";
import { doFetchAccessToken } from "redux/actions/user";
import { selectAccessToken, selectUser } from "redux/selectors/user";
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
