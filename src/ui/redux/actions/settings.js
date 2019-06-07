// @if TARGET='app'
import fs from 'fs';
import http from 'http';
// @endif
import { Lbry, ACTIONS, SETTINGS } from 'lbry-redux';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import moment from 'moment';
import analytics from 'analytics';

const UPDATE_IS_NIGHT_INTERVAL = 10 * 60 * 1000;

export function doFetchDaemonSettings() {
  return dispatch => {
    Lbry.settings_get().then(settings => {
      analytics.toggle(settings.share_usage_data);
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
  return dispatch => {
    const newSettings = {
      key,
      value: !value && value !== false ? null : value,
    };
    Lbry.settings_set(newSettings).then(newSettings);
    Lbry.settings_get().then(settings => {
      analytics.toggle(settings.share_usage_data);
      dispatch({
        type: ACTIONS.DAEMON_SETTINGS_RECEIVED,
        data: {
          settings,
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
  return dispatch => {
    const themes = ['light', 'dark'];
    dispatch(doSetClientSetting(SETTINGS.THEMES, themes));
  };
}

export function doUpdateIsNight() {
  const momentNow = moment();
  return {
    type: ACTIONS.UPDATE_IS_NIGHT,
    data: {
      isNight: (() => {
        const startNightMoment = moment('21:00', 'HH:mm');
        const endNightMoment = moment('8:00', 'HH:mm');
        return !(momentNow.isAfter(endNightMoment) && momentNow.isBefore(startNightMoment));
      })(),
    },
  };
}

export function doUpdateIsNightAsync() {
  return dispatch => {
    dispatch(doUpdateIsNight());

    setInterval(() => dispatch(doUpdateIsNight()), UPDATE_IS_NIGHT_INTERVAL);
  };
}

export function doDownloadLanguage(langFile) {
  return dispatch => {
    const destinationPath = `${i18n.directory}/${langFile}`;
    const language = langFile.replace('.json', '');
    const errorHandler = () => {
      fs.unlink(destinationPath, () => {}); // Delete the file async. (But we don't check the result)

      dispatch({
        type: ACTIONS.DOWNLOAD_LANGUAGE_FAILED,
        data: { language },
      });
    };

    const req = http.get(
      {
        headers: {
          'Content-Type': 'text/html',
        },
        host: 'i18n.lbry.com',
        path: `/langs/${langFile}`,
      },
      response => {
        if (response.statusCode === 200) {
          const file = fs.createWriteStream(destinationPath);

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

export function doInitLanguage() {
  return (dispatch, getState) => {
    const language = makeSelectClientSetting(SETTINGS.LANGUAGE)(getState());
    i18n.setLocale(language);
  };
}

export function doChangeLanguage(language) {
  return dispatch => {
    dispatch(doSetClientSetting(SETTINGS.LANGUAGE, language));
    i18n.setLocale(language);
  };
}
