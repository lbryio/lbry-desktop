import * as SETTINGS from 'constants/settings';
import * as DAEMON_SETTINGS from 'constants/daemon_settings';
import SUPPORTED_BROWSER_LANGUAGES from 'constants/supported_browser_languages';

import { createSelector } from 'reselect';
import { ENABLE_MATURE } from 'config';
import { getDefaultHomepageKey, getDefaultLanguage } from 'util/default-languages';
import { selectClaimWithId } from 'redux/selectors/claims';

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
  const homepages = window.homepages || {};
  return homepages[hp] ? hp : getDefaultHomepageKey();
};

export const selectLanguage = (state) => {
  const lang = selectClientSetting(state, SETTINGS.LANGUAGE);
  return lang || getDefaultLanguage();
};

export const selectHomepageData = (state) => {
  const homepageCode = selectHomepageCode(state);
  const homepages = window.homepages;
  return homepages ? homepages[homepageCode].categories || homepages['en'].categories || {} : {};
};

export const selectHomepageMeme = (state) => {
  const homepageCode = selectHomepageCode(state);
  const homepages = window.homepages;
  if (homepages) {
    const meme = homepages[homepageCode].meme;
    if (meme && meme.text && meme.url) {
      return meme;
    }
  }
  return homepages ? homepages['en'].meme || {} : {};
};

export const selectHomepageAnnouncement = (state) => {
  const homepageCode = selectHomepageCode(state);
  const homepages = window.homepages;
  if (homepages) {
    const news = homepages[homepageCode].announcement;
    if (news) {
      return news;
    }
  }
  return homepages ? homepages['en'].announcement || '' : '';
};

export const selectInRegionByCode = (state, code) => {
  const hp = selectClientSetting(state, SETTINGS.HOMEPAGE);
  const lang = selectLanguage(state);

  return hp === code || lang === code;
};

export const selectWildWestDisabled = (state) => {
  return selectInRegionByCode(state, SUPPORTED_BROWSER_LANGUAGES.de);
};

export const selectosNotificationsEnabled = (state) => selectClientSetting(state, SETTINGS.OS_NOTIFICATIONS_ENABLED);

export const selectDefaultChannelClaim = createSelector(
  (state) => selectClaimWithId(state, selectClientSetting(state, SETTINGS.ACTIVE_CHANNEL_CLAIM)),
  (defaultChannelClaim) => defaultChannelClaim
);
