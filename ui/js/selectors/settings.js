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

export const selectSettingsIsGenerous = createSelector(
  selectDaemonSettings,
  settings => settings && settings.is_generous_host
);

export const selectShowNsfw = createSelector(
  selectClientSettings,
  clientSettings => !!clientSettings.showNsfw
);
