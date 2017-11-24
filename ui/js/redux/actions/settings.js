import * as types from "constants/action_types";
import * as settings from "constants/settings";
import { doAlertError } from "redux/actions/app";
import batchActions from "util/batchActions";

import lbry from "lbry";
import fs from "fs";
import http from "http";

const { remote } = require("electron");
const { extname } = require("path");
const { readdir } = remote.require("fs");

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
  return {
    type: types.CLIENT_SETTING_CHANGED,
    data: {
      key,
      value,
    },
  };
}

export function doGetThemes() {
  return function(dispatch, getState) {
    const dir = `${remote.app.getAppPath()}/dist/themes`;

    readdir(dir, (error, files) => {
      if (!error) {
        dispatch(
          doSetClientSetting(
            settings.THEMES,
            files
              .filter(file => extname(file) === ".css")
              .map(file => file.replace(".css", ""))
          )
        );
      } else {
        dispatch(doAlertError(error));
      }
    });
  };
}

export function doDownloadLanguage(langFile) {
  return function(dispatch, getState) {
    const destinationPath = app.i18n.directory + "/" + langFile;
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
    //temporarily disable i18n so I can get a working build out -- Jeremy
    return;

    if (!fs.existsSync(app.i18n.directory)) {
      fs.mkdirSync(app.i18n.directory);
    }

    function checkStatus(response) {
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        throw new Error(
          __("The list of available languages could not be retrieved.")
        );
      }
    }

    function parseJSON(response) {
      return response.json();
    }

    return fetch("http://i18n.lbry.io")
      .then(checkStatus)
      .then(parseJSON)
      .then(files => {
        const actions = files.map(doDownloadLanguage);
        dispatch(batchActions(...actions));
      });
  };
}

export function doChangeLanguage(language) {
  return function(dispatch, getState) {
    dispatch(doSetClientSetting(settings.LANGUAGE, language));
    app.i18n.setLocale(language);
  };
}
