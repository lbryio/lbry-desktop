import * as types from "constants/action_types";
import * as settings from "constants/settings";
import batchActions from "util/batchActions";

import lbry from "lbry";
import fs from "fs";
import http from "http";

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

export function doDownloadLanguage(langFile) {
  return function(dispatch, getState) {
    const destinationPath = `app/locales/${langFile}`;
    const language = langFile.replace(".json", "");
    const req = http.get(
      {
        headers: {
          "Content-Type": "text/html",
        },
        host: "i18n.lbry.io",
        path: `/langs/${langFile}`,
      },
      response => {
        if (response.statusCode === 200) {
          const file = fs.createWriteStream(destinationPath);

          file.on("error", errorHandler);
          file.on("finish", () => {
            file.close();

            // push to our local list
            dispatch({
              type: types.DOWNLOAD_LANGUAGE_SUCCEEDED,
              data: { language: language },
            });
          });

          response.pipe(file);
        } else {
          errorHandler(new Error("Language request failed."));
        }
      }
    );

    const errorHandler = err => {
      fs.unlink(destinationPath, () => {}); // Delete the file async. (But we don't check the result)

      dispatch({
        type: types.DOWNLOAD_LANGUAGE_FAILED,
        data: { language },
      });
    };

    req.setTimeout(30000, function() {
      req.abort();
    });

    req.on("error", errorHandler);

    req.end();
  };
}

export function doDownloadLanguages() {
  return function(dispatch, getState) {
    if (!fs.existsSync(app.i18n.directory)) {
      fs.mkdirSync(app.i18n.directory);
    }

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          try {
            const files = JSON.parse(xhr.responseText);
            const actions = [];
            files.forEach(file => {
              actions.push(doDownloadLanguage(file));
            });

            dispatch(batchActions(...actions));
          } catch (err) {
            throw err;
          }
        } else {
          throw new Error(
            __("The list of available languages could not be retrieved.")
          );
        }
      }
    };
    xhr.open("get", "http://i18n.lbry.io");
    xhr.send();
  };
}

export function doChangeLanguage(language) {
  return function(dispatch, getState) {
    lbry.setClientSetting(settings.LANGUAGE, language);
    app.i18n.setLocale(language);
  };
}
