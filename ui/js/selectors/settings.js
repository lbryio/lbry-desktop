import * as settings from "constants/settings";
import { createSelector } from "reselect";

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

export const selectInstantPurchaseEnabled = makeSelectClientSetting(
  settings.INSTANT_PURCHASE_ENABLED
);

export const selectInstantPurchaseMax = makeSelectClientSetting(
  settings.INSTANT_PURCHASE_MAX
);

export const selectLanguages = createSelector(
  _selectState,
  state => state.languages || {}
);

export const selectThemePath = createSelector(
  makeSelectClientSetting(settings.THEME),
  theme => "themes/" + (theme || "light") + ".css"
);
