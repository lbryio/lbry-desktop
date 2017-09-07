import React from "react";
import { connect } from "react-redux";
import * as settings from "constants/settings";
import { doClearCache } from "actions/app";
import {
  doSetDaemonSetting,
  doSetClientSetting,
  doGetThemes,
  doSetTheme,
  doChangeLanguage,
} from "actions/settings";
import {
  makeSelectClientSetting,
  selectDaemonSettings,
  selectShowNsfw,
  selectLanguages,
} from "selectors/settings";
import { selectCurrentLanguage } from "selectors/app";
import SettingsPage from "./view";

const select = state => ({
  daemonSettings: selectDaemonSettings(state),
  showNsfw: selectShowNsfw(state),
  language: selectCurrentLanguage(state),
  languages: selectLanguages(state),
  theme: makeSelectClientSetting(settings.THEME)(state),
});

const perform = dispatch => ({
  setDaemonSetting: (key, value) => dispatch(doSetDaemonSetting(key, value)),
  clearCache: () => dispatch(doClearCache()),
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  getThemes: () => dispatch(doGetThemes()),
  changeLanguage: newLanguage => dispatch(doChangeLanguage(newLanguage)),
});

export default connect(select, perform)(SettingsPage);
