import * as SETTINGS from 'constants/settings';
import * as DAEMON_SETTINGS from 'constants/daemon_settings';

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

// TODO - kill this
export const makeSelectClientSetting = (setting) =>
  createSelector(selectClientSettings, (settings) => (settings ? settings[setting] : undefined));

// refactor me
export const selectShowMatureContent = (state) => {
  return !ENABLE_MATURE ? false : selectClientSetting(state, SETTINGS.SHOW_MATURE);
};

// and me
export const selectShowRepostedContent = makeSelectClientSetting(SETTINGS.HIDE_REPOSTS);

export const selectTheme = makeSelectClientSetting(SETTINGS.THEME);
export const selectAutomaticDarkModeEnabled = makeSelectClientSetting(SETTINGS.AUTOMATIC_DARK_MODE_ENABLED);
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

export const selectHomepageCode = createSelector(makeSelectClientSetting(SETTINGS.HOMEPAGE), (setting) => {
  return homepages[setting] ? setting : getDefaultHomepageKey();
});

export const selectLanguage = createSelector(makeSelectClientSetting(SETTINGS.LANGUAGE), (setting) => {
  return setting || getDefaultLanguage();
});

export const selectHomepageData = createSelector(
  // using homepage setting,
  selectHomepageCode,
  (homepageCode) => {
    // homepages = { 'en': homepageFile, ... }
    // mixin Homepages here
    return homepages[homepageCode] || homepages['en'] || {};
  }
);

export const selectosNotificationsEnabled = makeSelectClientSetting(SETTINGS.OS_NOTIFICATIONS_ENABLED);
