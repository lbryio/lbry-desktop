import Lbry from 'lbry';
import { doWalletReconnect } from 'redux/actions/wallet';
import * as SETTINGS from 'constants/settings';
import * as DAEMON_SETTINGS from 'constants/daemon_settings';
import * as ACTIONS from 'constants/action_types';
import * as MODALS from 'constants/modal_types';
import * as SHARED_PREFERENCES from 'constants/shared_preferences';
import { doToast } from 'redux/actions/notifications';
import analytics from 'analytics';
import SUPPORTED_LANGUAGES from 'constants/supported_languages';
import { launcher } from 'util/autoLaunch';
import { selectClientSetting } from 'redux/selectors/settings';
import { doSyncLoop, doSyncUnsubscribe, doSetSyncLock } from 'redux/actions/sync';
import { doAlertWaitingForSync, doGetAndPopulatePreferences, doOpenModal } from 'redux/actions/app';
import { selectPrefsReady } from 'redux/selectors/sync';
import { Lbryio } from 'lbryinc';
import { getDefaultLanguage } from 'util/default-languages';

const { DEFAULT_LANGUAGE, URL_DEV } = require('config');
const { SDK_SYNC_KEYS } = SHARED_PREFERENCES;

export const IS_MAC = process.platform === 'darwin';
const UPDATE_IS_NIGHT_INTERVAL = 5 * 60 * 1000;

export function doFetchDaemonSettings() {
  return (dispatch) => {
    Lbry.settings_get().then((settings) => {
      analytics.toggleInternal(settings.share_usage_data);
      dispatch({
        type: ACTIONS.DAEMON_SETTINGS_RECEIVED,
        data: {
          settings,
        },
      });
    });
  };
}

export function doFindFFmpeg() {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.FINDING_FFMPEG_STARTED,
    });
    return Lbry.ffmpeg_find().then((done) => {
      dispatch(doGetDaemonStatus());
      dispatch({
        type: ACTIONS.FINDING_FFMPEG_COMPLETED,
      });
    });
  };
}

export function doGetDaemonStatus() {
  return (dispatch) => {
    return Lbry.status().then((status) => {
      dispatch({
        type: ACTIONS.DAEMON_STATUS_RECEIVED,
        data: {
          status,
        },
      });
      return status;
    });
  };
}

export function doClearDaemonSetting(key) {
  return (dispatch, getState) => {
    const state = getState();
    const ready = selectPrefsReady(state);

    if (!ready) {
      return dispatch(doAlertWaitingForSync());
    }

    const clearKey = {
      key,
    };
    // not if syncLocked
    Lbry.settings_clear(clearKey).then((defaultSettings) => {
      if (SDK_SYNC_KEYS.includes(key)) {
        dispatch({
          type: ACTIONS.SHARED_PREFERENCE_SET,
          data: { key: key, value: null },
        });
      }
      if (key === DAEMON_SETTINGS.LBRYUM_SERVERS) {
        dispatch(doWalletReconnect());
      }
    });
    Lbry.settings_get().then((settings) => {
      analytics.toggleInternal(settings.share_usage_data);
      dispatch({
        type: ACTIONS.DAEMON_SETTINGS_RECEIVED,
        data: {
          settings,
        },
      });
    });
  };
}
// if doPopulate is applying settings, we don't want to cause a loop; doNotDispatch = true.
export function doSetDaemonSetting(key, value, doNotDispatch = false) {
  return (dispatch, getState) => {
    const state = getState();
    const ready = selectPrefsReady(state);

    if (!ready) {
      return dispatch(doAlertWaitingForSync());
    }

    const newSettings = {
      key,
      value: !value && value !== false ? null : value,
    };
    Lbry.settings_set(newSettings).then((newSetting) => {
      if (SDK_SYNC_KEYS.includes(key) && !doNotDispatch) {
        dispatch({
          type: ACTIONS.SHARED_PREFERENCE_SET,
          data: { key: key, value: newSetting[key] },
        });
      }
      // hardcoding this in lieu of a better solution
      if (key === DAEMON_SETTINGS.LBRYUM_SERVERS) {
        dispatch(doWalletReconnect());
        // todo: add sdk reloadsettings() (or it happens automagically?)
      }
    });
    Lbry.settings_get().then((settings) => {
      analytics.toggleInternal(settings.share_usage_data);
      dispatch({
        type: ACTIONS.DAEMON_SETTINGS_RECEIVED,
        data: {
          settings,
        },
      });
    });
  };
}

export function doSaveCustomWalletServers(servers) {
  return {
    type: ACTIONS.SAVE_CUSTOM_WALLET_SERVERS,
    data: servers,
  };
}

export function doSetClientSetting(key, value, pushPrefs) {
  return (dispatch, getState) => {
    const state = getState();
    const ready = selectPrefsReady(state);

    if (!ready && pushPrefs) {
      return dispatch(doAlertWaitingForSync());
    }

    dispatch({
      type: ACTIONS.CLIENT_SETTING_CHANGED,
      data: {
        key,
        value,
      },
    });

    if (pushPrefs) {
      dispatch(doPushSettingsToPrefs());
    }
  };
}

export function doUpdateIsNight() {
  return {
    type: ACTIONS.UPDATE_IS_NIGHT,
  };
}

export function doUpdateIsNightAsync() {
  return (dispatch) => {
    dispatch(doUpdateIsNight());

    setInterval(() => dispatch(doUpdateIsNight()), UPDATE_IS_NIGHT_INTERVAL);
  };
}

export function doSetDarkTime(value, options) {
  const { fromTo, time } = options;
  return (dispatch, getState) => {
    const state = getState();
    const darkModeTimes = state.settings.clientSettings[SETTINGS.DARK_MODE_TIMES];
    const { hour, min } = darkModeTimes[fromTo];
    const newHour = time === 'hour' ? value : hour;
    const newMin = time === 'min' ? value : min;
    const modifiedTimes = {
      [fromTo]: {
        hour: newHour,
        min: newMin,
        formattedTime: newHour + ':' + newMin,
      },
    };
    const mergedTimes = { ...darkModeTimes, ...modifiedTimes };

    dispatch(doSetClientSetting(SETTINGS.DARK_MODE_TIMES, mergedTimes));
    dispatch(doUpdateIsNight());
  };
}

export function doGetWalletSyncPreference() {
  const SYNC_KEY = 'enable-sync';
  return (dispatch) => {
    return Lbry.preference_get({ key: SYNC_KEY }).then((result) => {
      const enabled = result && result[SYNC_KEY];
      if (enabled !== null) {
        dispatch(doSetClientSetting(SETTINGS.ENABLE_SYNC, enabled));
      }
      return enabled;
    });
  };
}

export function doSetWalletSyncPreference(pref) {
  const SYNC_KEY = 'enable-sync';
  return (dispatch) => {
    return Lbry.preference_set({ key: SYNC_KEY, value: pref }).then((result) => {
      const enabled = result && result[SYNC_KEY];
      if (enabled !== null) {
        dispatch(doSetClientSetting(SETTINGS.ENABLE_SYNC, enabled));
      }
      return enabled;
    });
  };
}

export function doPushSettingsToPrefs() {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: ACTIONS.SYNC_CLIENT_SETTINGS,
      });
      resolve();
    });
  };
}

export function doEnterSettingsPage() {
  return async (dispatch, getState) => {
    const state = getState();
    const syncEnabled = selectClientSetting(state, SETTINGS.ENABLE_SYNC);
    const hasVerifiedEmail = state.user && state.user.user && state.user.user.has_verified_email;
    if (IS_WEB && !hasVerifiedEmail) {
      return;
    }
    dispatch(doSyncUnsubscribe());
    if (syncEnabled && hasVerifiedEmail) {
      await dispatch(doSyncLoop(true));
    } else {
      await dispatch(doGetAndPopulatePreferences());
    }
    dispatch(doSetSyncLock(true));
  };
}

export function doExitSettingsPage() {
  return (dispatch, getState) => {
    const state = getState();
    const hasVerifiedEmail = state.user && state.user.user && state.user.user.has_verified_email;
    if (IS_WEB && !hasVerifiedEmail) {
      return;
    }
    dispatch(doSetSyncLock(false));
    dispatch(doPushSettingsToPrefs());
    // syncLoop is restarted in store.js sharedStateCB if necessary
  };
}

export function doFetchLanguage(language) {
  return (dispatch, getState) => {
    const { settings } = getState();

    if (settings.language !== language || (settings.loadedLanguages && !settings.loadedLanguages.includes(language))) {
      // this should match the behavior/logic in index-web.html
      fetch('https://lbry.com/i18n/get/lbry-desktop/app-strings/' + language + '.json')
        .then((r) => r.json())
        .then((j) => {
          window.i18n_messages[language] = j;
          dispatch({
            type: ACTIONS.DOWNLOAD_LANGUAGE_SUCCESS,
            data: {
              language,
            },
          });
        })
        .catch((e) => {
          dispatch({
            type: ACTIONS.DOWNLOAD_LANGUAGE_FAILURE,
          });
        });
    }

    // @if process.env.NODE_ENV!='production'
    if (!window.app_strings) {
      fetch(`${URL_DEV}/app-strings.json`)
        .then((r) => r.json())
        .then((j) => {
          window.app_strings = j;
        })
        .catch(() => {});
    }
    // @endif
  };
}

function populateCategoryTitles(categories) {
  if (categories) {
    window.CATEGORY_PAGE_TITLE = {};
    Object.values(categories).forEach((x) => {
      window.CATEGORY_PAGE_TITLE[x.name] = x.label;
    });
  }
}

function loadBuiltInHomepageData(dispatch) {
  const homepages = require('homepages');
  if (homepages) {
    const v2 = {};
    const homepageKeys = Object.keys(homepages);
    homepageKeys.forEach((hp) => {
      v2[hp] = homepages[hp];
    });

    window.homepages = v2;
    populateCategoryTitles(window.homepages?.en?.categories);
    dispatch({ type: ACTIONS.FETCH_HOMEPAGES_DONE });
  }
}

export function doOpenAnnouncements() {
  return (dispatch) => {
    // There is a weird useEffect in modalRouter that closes all modals on
    // initial mount. Not sure what scenario that covers, so just delay a bit
    // until it is mounted.
    setTimeout(() => {
      dispatch(doOpenModal(MODALS.ANNOUNCEMENTS, { isAutoInvoked: true }));
    }, 1000);
  };
}

export function doFetchHomepages() {
  return (dispatch) => {
    // -- Use this env flag to use local homepage data and meme (faster).
    // -- Otherwise, it will grab from `/$/api/content/v*/get`.
    // @if USE_LOCAL_HOMEPAGE_DATA='true'
    loadBuiltInHomepageData(dispatch);
    // @endif

    fetch('https://odysee.com/$/api/content/v2/get')
      .then((response) => response.json())
      .then((json) => {
        if (json?.status === 'success' && json?.data) {
          window.homepages = json.data;
          populateCategoryTitles(window.homepages?.en?.categories);
          dispatch({ type: ACTIONS.FETCH_HOMEPAGES_DONE });
        } else {
          dispatch({ type: ACTIONS.FETCH_HOMEPAGES_FAILED });
        }
      })
      .catch(() => {
        dispatch({ type: ACTIONS.FETCH_HOMEPAGES_FAILED });
      });
  };
}

export function doSetHomepage(code) {
  return (dispatch, getState) => {
    const languageCode = code === getDefaultLanguage() ? null : code;

    dispatch(doSetClientSetting(SETTINGS.HOMEPAGE, languageCode));
  };
}

export function doSetLanguage(language) {
  return (dispatch, getState) => {
    const { settings } = getState();
    const { daemonSettings } = settings;
    const { share_usage_data: shareSetting } = daemonSettings;
    const isSharingData = shareSetting || IS_WEB;
    let languageSetting;
    if (language === getDefaultLanguage()) {
      languageSetting = null;
    } else {
      languageSetting = language;
    }

    if (
      settings.language !== languageSetting ||
      (settings.loadedLanguages && !settings.loadedLanguages.includes(language))
    ) {
      // this should match the behavior/logic in index-web.html
      fetch('https://lbry.com/i18n/get/lbry-desktop/app-strings/' + language + '.json')
        .then((r) => r.json())
        .then((j) => {
          window.i18n_messages[language] = j;
          dispatch({
            type: ACTIONS.DOWNLOAD_LANGUAGE_SUCCESS,
            data: {
              language,
            },
          });
        })
        .then(() => {
          // set on localStorage so it can be read outside of redux
          window.localStorage.setItem(SETTINGS.LANGUAGE, language);
          dispatch(doSetClientSetting(SETTINGS.LANGUAGE, languageSetting));
          if (isSharingData) {
            Lbryio.call('user', 'language', {
              language: language,
            });
          }
        })
        .catch((e) => {
          window.localStorage.setItem(SETTINGS.LANGUAGE, DEFAULT_LANGUAGE);
          dispatch(doSetClientSetting(SETTINGS.LANGUAGE, DEFAULT_LANGUAGE));
          const languageName = SUPPORTED_LANGUAGES[language] ? SUPPORTED_LANGUAGES[language] : language;
          dispatch(
            doToast({
              message: __('Failed to load %language% translations.', { language: languageName }),
              isError: true,
            })
          );
        });
    }
  };
}

export function doSetAutoLaunch(value) {
  return (dispatch, getState) => {
    const state = getState();
    const autoLaunch = selectClientSetting(state, SETTINGS.AUTO_LAUNCH);

    if (IS_MAC || process.env.NODE_ENV !== 'production') {
      return;
    }

    if (value === undefined) {
      launcher.isEnabled().then((isEnabled) => {
        if (isEnabled) {
          if (!autoLaunch) {
            launcher.disable().then(() => {
              dispatch(doSetClientSetting(SETTINGS.AUTO_LAUNCH, false));
            });
          }
        } else {
          if (autoLaunch || autoLaunch === null || autoLaunch === undefined) {
            launcher.enable().then(() => {
              dispatch(doSetClientSetting(SETTINGS.AUTO_LAUNCH, true));
            });
          }
        }
      });
    } else if (value === true) {
      launcher.isEnabled().then(function (isEnabled) {
        if (!isEnabled) {
          launcher.enable().then(() => {
            dispatch(doSetClientSetting(SETTINGS.AUTO_LAUNCH, true));
          });
        } else {
          dispatch(doSetClientSetting(SETTINGS.AUTO_LAUNCH, true));
        }
      });
    } else {
      // value = false
      launcher.isEnabled().then(function (isEnabled) {
        if (isEnabled) {
          launcher.disable().then(() => {
            dispatch(doSetClientSetting(SETTINGS.AUTO_LAUNCH, false));
          });
        } else {
          dispatch(doSetClientSetting(SETTINGS.AUTO_LAUNCH, false));
        }
      });
    }
  };
}

export function doSetAppToTrayWhenClosed(value) {
  return (dispatch) => {
    window.localStorage.setItem(SETTINGS.TO_TRAY_WHEN_CLOSED, value);
    dispatch(doSetClientSetting(SETTINGS.TO_TRAY_WHEN_CLOSED, value));
  };
}

export function toggleVideoTheaterMode() {
  return (dispatch, getState) => {
    const state = getState();
    const videoTheaterMode = selectClientSetting(state, SETTINGS.VIDEO_THEATER_MODE);

    dispatch(doSetClientSetting(SETTINGS.VIDEO_THEATER_MODE, !videoTheaterMode));
  };
}

export function toggleAutoplayNext() {
  return (dispatch, getState) => {
    const state = getState();
    const ready = selectPrefsReady(state);
    const autoplayNext = selectClientSetting(state, SETTINGS.AUTOPLAY_NEXT);

    dispatch(doSetClientSetting(SETTINGS.AUTOPLAY_NEXT, !autoplayNext, ready));

    dispatch(
      doToast({
        message: autoplayNext ? __('Autoplay Next is off.') : __('Autoplay Next is on.'),
      })
    );
  };
}

export const doSetDefaultVideoQuality = (value) => (dispatch) =>
  dispatch(doSetClientSetting(SETTINGS.DEFAULT_VIDEO_QUALITY, value, true));

export const doSetDefaultChannel = (claimId) => (dispatch) =>
  dispatch(doSetClientSetting(SETTINGS.ACTIVE_CHANNEL_CLAIM, claimId, true));
