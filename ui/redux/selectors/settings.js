import * as SETTINGS from 'constants/settings';
import * as DAEMON_SETTINGS from 'constants/daemon_settings';
import SUPPORTED_BROWSER_LANGUAGES from 'constants/supported_browser_languages';

import { createSelector } from 'reselect';
import { ENABLE_MATURE } from 'config';
import { getDefaultHomepageKey, getDefaultLanguage } from 'util/default-languages';
const homepages = require('homepages');

const selectState = (state) => state.settings || {};

export const selectDaemonSettings = (state) => selectState(state).daemonSettings;
export const selectDaemonStatus = (state) => selectState(state).daemonStatus;
export const selectFfmpegStatus = createSelector(selectDaemonStatus, (status) => status.ffmpeg_status);
export const selectFindingFFmpeg = (state) => selectState(state).findingFFmpeg || false;
export const selectClientSettings = (state) => selectState(state).clientSettings || {};
export const selectLoadedLanguages = (state) => selectState(state).loadedLanguages || {};

export const selectClientSetting = (state, setting) => {
  const clientSettings = selectClientSettings(state);
  return clientSettings ? clientSettings[setting] : undefined;
};

// refactor me
export const selectShowMatureContent = (state) => {
  return !ENABLE_MATURE ? false : selectClientSetting(state, SETTINGS.SHOW_MATURE);
};

export const selectTheme = (state) => selectClientSetting(state, SETTINGS.THEME);
export const selectAutomaticDarkModeEnabled = (state) =>
  selectClientSetting(state, SETTINGS.AUTOMATIC_DARK_MODE_ENABLED);
export const selectIsNight = (state) => selectState(state).isNight;
export const selectSavedWalletServers = (state) => selectState(state).customWalletServers;
export const selectSharedPreferences = (state) => selectState(state).sharedPreferences;

export const makeSelectSharedPreferencesForKey = (key) =>
  createSelector(selectSharedPreferences, (prefs) => (prefs ? prefs[key] : undefined));

export const selectHasWalletServerPrefs = createSelector(
  makeSelectSharedPreferencesForKey(DAEMON_SETTINGS.LBRYUM_SERVERS),
  (servers) => {
    return !!(servers && servers.length);
  }
);

export const selectThemePath = createSelector(
  selectTheme,
  selectAutomaticDarkModeEnabled,
  selectIsNight,
  (theme, automaticDarkModeEnabled, isNight) => {
    const dynamicTheme = automaticDarkModeEnabled && isNight ? 'dark' : theme;
    return dynamicTheme || 'light';
  }
);

export const selectHomepageCode = (state) => {
  const hp = selectClientSetting(state, SETTINGS.HOMEPAGE);
  return homepages[hp] ? hp : getDefaultHomepageKey();
};

export const selectLanguage = (state) => {
  const lang = selectClientSetting(state, SETTINGS.LANGUAGE);
  return lang || getDefaultLanguage();
};

export const selectHomepageData = createSelector(
  // using homepage setting,
  selectHomepageCode,
  (homepageCode) => {
    // homepages = { 'en': homepageFile, ... }
    // mixin Homepages here
    return homepages[homepageCode] || homepages['en'] || {};
  }
);

export const selectInRegionByCode = (state, code) => {
  const hp = selectClientSetting(state, SETTINGS.HOMEPAGE);
  const lang = selectLanguage(state);

  return hp === code || lang === code;
};

export const selectWildWestDisabled = (state) => {
  const deRegion = selectInRegionByCode(state, SUPPORTED_BROWSER_LANGUAGES.de);

  return deRegion;
};

export const selectosNotificationsEnabled = (state) => selectClientSetting(state, SETTINGS.OS_NOTIFICATIONS_ENABLED);
