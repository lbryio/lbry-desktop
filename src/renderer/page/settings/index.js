import React from 'react';
import { connect } from 'react-redux';
import * as settings from 'constants/settings';
import { doClearCache } from 'redux/actions/app';
import {
  doSetDaemonSetting,
  doSetClientSetting,
  doGetThemes,
  doSetTheme,
  doChangeLanguage,
} from 'redux/actions/settings';
import {
  makeSelectClientSetting,
  selectDaemonSettings,
  selectLanguages,
} from 'redux/selectors/settings';
import { selectCurrentLanguage } from 'redux/selectors/app';
import SettingsPage from './view';

const select = state => ({
  daemonSettings: selectDaemonSettings(state),
  showNsfw: makeSelectClientSetting(settings.SHOW_NSFW)(state),
  showUnavailable: makeSelectClientSetting(settings.SHOW_UNAVAILABLE)(state),
  instantPurchaseEnabled: makeSelectClientSetting(settings.INSTANT_PURCHASE_ENABLED)(state),
  instantPurchaseMax: makeSelectClientSetting(settings.INSTANT_PURCHASE_MAX)(state),
  showUnavailable: makeSelectClientSetting(settings.SHOW_UNAVAILABLE)(state),
  theme: makeSelectClientSetting(settings.THEME)(state),
  themes: makeSelectClientSetting(settings.THEMES)(state),
  language: selectCurrentLanguage(state),
  languages: selectLanguages(state),
  automaticDarkModeEnabled: makeSelectClientSetting(settings.AUTOMATIC_DARK_MODE_ENABLED)(state),
});

const perform = dispatch => ({
  setDaemonSetting: (key, value) => dispatch(doSetDaemonSetting(key, value)),
  clearCache: () => dispatch(doClearCache()),
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  getThemes: () => dispatch(doGetThemes()),
  changeLanguage: newLanguage => dispatch(doChangeLanguage(newLanguage)),
});

export default connect(select, perform)(SettingsPage);
