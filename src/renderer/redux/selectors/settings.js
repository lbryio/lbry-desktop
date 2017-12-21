import * as SETTINGS from 'constants/settings';
import { createSelector } from 'reselect';

const selectState = state => state.settings || {};

export const selectDaemonSettings = createSelector(selectState, state => state.daemonSettings);

export const selectClientSettings = createSelector(
  selectState,
  state => state.clientSettings || {}
);

export const makeSelectClientSetting = setting =>
  createSelector(selectClientSettings, settings => (settings ? settings[setting] : undefined));

export const selectSettingsIsGenerous = createSelector(
  selectDaemonSettings,
  settings => settings && settings.is_generous_host
);

// refactor me
export const selectShowNsfw = makeSelectClientSetting(SETTINGS.SHOW_NSFW);

export const selectLanguages = createSelector(selectState, state => state.languages || {});

export const selectThemePath = createSelector(
  makeSelectClientSetting(SETTINGS.THEME),
  theme => `${staticResourcesPath}/themes/${theme || 'light'}.css`
);
