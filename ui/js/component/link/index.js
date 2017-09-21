import React from "react";
import { connect } from "react-redux";
import { doNavigate } from "actions/navigation";
import Link from "./view";

const perform = dispatch => ({
  doNavigate: (path, params) => dispatch(doNavigate(path, params)),
});

export default connect(null, perform)(Link);
