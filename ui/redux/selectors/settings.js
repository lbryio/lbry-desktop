import * as SETTINGS from 'constants/settings';
import { SHARED_PREFERENCES } from 'lbry-redux';
import { createSelector } from 'reselect';

const selectState = state => state.settings || {};

export const selectDaemonSettings = createSelector(
  selectState,
  state => state.daemonSettings
);

export const selectDaemonStatus = createSelector(
  selectState,
  state => state.daemonStatus
);

export const selectClientSettings = createSelector(
  selectState,
  state => state.clientSettings || {}
);

export const selectLoadedLanguages = createSelector(
  selectState,
  state => state.loadedLanguages || {}
);

export const makeSelectClientSetting = setting =>
  createSelector(
    selectClientSettings,
    settings => (settings ? settings[setting] : undefined)
  );

// refactor me
export const selectShowMatureContent = makeSelectClientSetting(SETTINGS.SHOW_MATURE);

export const selectTheme = makeSelectClientSetting(SETTINGS.THEME);
export const selectAutomaticDarkModeEnabled = makeSelectClientSetting(SETTINGS.AUTOMATIC_DARK_MODE_ENABLED);
export const selectIsNight = createSelector(
  selectState,
  state => state.isNight
);

export const selectSavedWalletServers = createSelector(
  selectState,
  state => state.customWalletServers
);

export const selectSharedPreferences = createSelector(
  selectState,
  state => state.sharedPreferences
);

export const makeSelectSharedPreferencesForKey = key =>
  createSelector(
    selectSharedPreferences,
    prefs => (prefs ? prefs[key] : undefined)
  );

export const selectHasWalletServerPrefs =
  createSelector(
    makeSelectSharedPreferencesForKey(SHARED_PREFERENCES.WALLET_SERVERS),
    servers => {
      if (servers && servers.length) return true;
      return false;
    }
  )

export const selectThemePath = createSelector(
  selectTheme,
  selectAutomaticDarkModeEnabled,
  selectIsNight,
  (theme, automaticDarkModeEnabled, isNight) => {
    const dynamicTheme = automaticDarkModeEnabled && isNight ? 'dark' : theme;
    return dynamicTheme || 'light';
  }
);

export const selectosNotificationsEnabled = makeSelectClientSetting(SETTINGS.OS_NOTIFICATIONS_ENABLED);
