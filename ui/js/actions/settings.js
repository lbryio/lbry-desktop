import * as types from "constants/action_types";
import lbry from "lbry";
import { readdirSync } from "fs";
import { extname } from "path";
import { remote } from "electron";

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

export function doSetTheme(themeName) {
  const name = themeName || "light";
  const link = document.getElementById("theme");

  return function(dispatch, getState) {
    const { themes } = getState().settings.clientSettings;
    const theme = themes.find(theme => theme.name === name);

    if (theme) {
      link.href = theme.path;
      dispatch(doSetClientSetting("theme", theme));
    }
  };
}

export function doGetThemes() {
  const path = `${remote.app.getAppPath()}/dist/themes`;

  // Get all .css files
  const files = readdirSync(path).filter(file => extname(file) === ".css");

  return function(dispatch, getState) {
    // Find themes
    const themes = files.map(file => ({
      name: file.replace(".css", ""),
      path: `./themes/${file}`,
    }));

    dispatch(doSetClientSetting("themes", themes));
  };
}
