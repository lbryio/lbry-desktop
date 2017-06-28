import React from "react";
import { connect } from "react-redux";
import { doClearCache } from "actions/app";
import { doSetDaemonSetting, doSetClientSetting } from "actions/settings";
import { selectDaemonSettings, selectShowNsfw } from "selectors/settings";
import SettingsPage from "./view";

const select = state => ({
  daemonSettings: selectDaemonSettings(state),
  showNsfw: selectShowNsfw(state),
});

const perform = dispatch => ({
  setDaemonSetting: (key, value) => dispatch(doSetDaemonSetting(key, value)),
  clearCache: () => dispatch(doClearCache()),
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
});

export default connect(select, perform)(SettingsPage);
