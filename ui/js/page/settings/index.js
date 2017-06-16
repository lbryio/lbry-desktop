import React from "react";
import { connect } from "react-redux";
import { doClearCache } from "actions/app";
import { doSetDaemonSetting } from "actions/settings";
import { selectDaemonSettings } from "selectors/settings";
import SettingsPage from "./view";

const select = state => ({
  daemonSettings: selectDaemonSettings(state),
});

const perform = dispatch => ({
  setDaemonSetting: (key, value) => dispatch(doSetDaemonSetting(key, value)),
  clearCache: () => dispatch(doClearCache()),
});

export default connect(select, perform)(SettingsPage);
