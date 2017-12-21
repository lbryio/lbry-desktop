import * as ACTIONS from 'constants/action_types';
import * as SETTINGS from 'constants/settings';

import Lbry from 'lbry';
import Fs from 'fs';
import Http from 'http';

export function doFetchDaemonSettings() {
  return function(dispatch) {
    Lbry.settings_get().then(settings => {
      dispatch({
        type: ACTIONS.DAEMON_SETTINGS_RECEIVED,
        data: {
          settings,
        },
      });
    });
  };
}

export function doSetDaemonSetting(key, value) {
  return function(dispatch) {
    const settings = {};
    settings[key] = value;
    Lbry.settings_set(settings).then(settings);
    Lbry.settings_get().then(remoteSettings => {
      dispatch({
        type: ACTIONS.DAEMON_SETTINGS_RECEIVED,
        data: {
          remoteSettings,
        },
      });
    });
  };
}

export function doSetClientSetting(key, value) {
  return {
    type: ACTIONS.CLIENT_SETTING_CHANGED,
    data: {
      key,
      value,
    },
  };
}

export function doGetThemes() {
  return function(dispatch) {
    const themes = ['light', 'dark'];
    dispatch(doSetClientSetting(SETTINGS.THEMES, themes));
  };
}

export function doDownloadLanguage(langFile) {
  return function(dispatch) {
    const destinationPath = `${app.i18n.directory}/${langFile}`;
    const language = langFile.replace('.json', '');
    const errorHandler = () => {
      Fs.unlink(destinationPath, () => {}); // Delete the file async. (But we don't check the result)

      dispatch({
        type: ACTIONS.DOWNLOAD_LANGUAGE_FAILED,
        data: { language },
      });
    };

    const req = Http.get(
      {
        headers: {
          'Content-Type': 'text/html',
        },
        host: 'i18n.lbry.io',
        path: `/langs/${langFile}`,
      },
      response => {
        if (response.statusCode === 200) {
          const file = Fs.createWriteStream(destinationPath);

          file.on('error', errorHandler);
          file.on('finish', () => {
            file.close();

            // push to our local list
            dispatch({
              type: ACTIONS.DOWNLOAD_LANGUAGE_SUCCEEDED,
              data: { language },
            });
          });

          response.pipe(file);
        } else {
          errorHandler(new Error('Language request failed.'));
        }
      }
    );

    req.setTimeout(30000, () => {
      req.abort();
    });

    req.on('error', errorHandler);

    req.end();
  };
}

export function doDownloadLanguages() {
  return function() {
    // temporarily disable i18n so I can get a working build out -- Jeremy
    // if (!Fs.existsSync(app.i18n.directory)) {
    //   Fs.mkdirSync(app.i18n.directory);
    // }
    //
    // function checkStatus(response) {
    //   if (response.status >= 200 && response.status < 300) {
    //     return response;
    //   }
    //   throw new Error(
    //     __("The list of available languages could not be retrieved.")
    //   );
    // }
    //
    // function parseJSON(response) {
    //   return response.json();
    // }
    //
    // return fetch("http://i18n.lbry.io")
    //   .then(checkStatus)
    //   .then(parseJSON)
    //   .then(files => {
    //     const actions = files.map(doDownloadLanguage);
    //     dispatch(batchActions(...actions));
    //   });
  };
}

export function doChangeLanguage(language) {
  return function(dispatch) {
    dispatch(doSetClientSetting(SETTINGS.LANGUAGE, language));
    app.i18n.setLocale(language);
  };
}
