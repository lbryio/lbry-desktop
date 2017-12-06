import * as settings from "constants/settings";
import { createSelector } from "reselect";
import path from "path";

const _selectState = state => state.settings || {};

export const selectDaemonSettings = createSelector(
  _selectState,
  state => state.daemonSettings
);

export const selectClientSettings = createSelector(
  _selectState,
  state => state.clientSettings || {}
);

export const makeSelectClientSetting = setting => {
  return createSelector(
    selectClientSettings,
    settings => (settings ? settings[setting] : undefined)
  );
};

export const selectSettingsIsGenerous = createSelector(
  selectDaemonSettings,
  settings => settings && settings.is_generous_host
);

//refactor me
export const selectShowNsfw = makeSelectClientSetting(settings.SHOW_NSFW);

export const selectLanguages = createSelector(
  _selectState,
  state => state.languages || {}
);

export const selectThemePath = createSelector(
  makeSelectClientSetting(settings.THEME),
  theme => __static + "/themes/" + (theme || "light") + ".css"
);
