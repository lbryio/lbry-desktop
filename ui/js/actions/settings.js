import * as types from "constants/action_types";
import * as settings from "constants/settings";
import lbry from "lbry";

const { remote } = require("electron");
const { extname } = require("path");
const { download } = remote.require("electron-dl");
const { readdirSync } = remote.require("fs");

export function doFetchDaemonSettings() {
  return function(dispatch, getState) {
    lbry.settings_get().then(settings => {
      dispatch({
        type: types.DAEMON_SETTINGS_RECEIVED,
        data: {
          settings,
        },
      });
    });
  };
}

export function doSetDaemonSetting(key, value) {
  return function(dispatch, getState) {
    let settings = {};
    settings[key] = value;
    lbry.settings_set(settings).then(settings);
    lbry.settings_get().then(settings => {
      dispatch({
        type: types.DAEMON_SETTINGS_RECEIVED,
        data: {
          settings,
        },
      });
    });
  };
}

export function doSetClientSetting(key, value) {
  lbry.setClientSetting(key, value);

  return {
    type: types.CLIENT_SETTING_CHANGED,
    data: {
      key,
      value,
    },
  };
}

export function doGetThemes() {
  const dir = `${remote.app.getAppPath()}/dist/themes`;

  // Get all .css files
  const files = readdirSync(dir).filter(file => extname(file) === ".css");

  return function(dispatch, getState) {
    // Find themes
    const themes = files.map(file => ({
      name: file.replace(".css", ""),
      path: `./themes/${file}`,
    }));

    dispatch(doSetClientSetting(settings.THEMES, themes));
  };
}

export function doSetTheme(name) {
  return function(dispatch, getState) {
    // Find a theme from themes list
    const find = themeName => themes.find(theme => theme.name === themeName);

    // Get themes
    const themes = lbry.getClientSetting(settings.THEMES);

    // Find theme and set fallback
    const theme = find(name) || find("light");

    if (theme.path) {
      // load css
      const link = document.getElementById("theme");
      link.href = theme.path;

      // update theme
      dispatch(doSetClientSetting(settings.THEME, theme.name));
    }
  };
}
