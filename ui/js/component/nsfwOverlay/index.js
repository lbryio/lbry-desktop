import React from "react";
import { connect } from "react-redux";
import { doNavigate } from "actions/app";
import NsfwOverlay from "./view";

const perform = dispatch => ({
  navigateSettings: () => dispatch(doNavigate("/settings")),
});

export default connect(null, perform)(NsfwOverlay);
