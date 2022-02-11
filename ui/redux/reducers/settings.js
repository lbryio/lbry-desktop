import * as ACTIONS from 'constants/action_types';
import * as SETTINGS from 'constants/settings';
import * as SHARED_PREFERENCES from 'constants/shared_preferences';
import moment from 'moment';
import { getSubsetFromKeysArray } from 'util/sync-settings';
import { getDefaultLanguage } from 'util/default-languages';
import { UNSYNCED_SETTINGS } from 'config';

const { CLIENT_SYNC_KEYS } = SHARED_PREFERENCES;
const settingsToIgnore = (UNSYNCED_SETTINGS && UNSYNCED_SETTINGS.trim().split(' ')) || [];
const clientSyncKeys = settingsToIgnore.length
  ? CLIENT_SYNC_KEYS.filter((k) => !settingsToIgnore.includes(k))
  : CLIENT_SYNC_KEYS;

const reducers = {};
let settingLanguage = [];
try {
  let appLanguage = window.localStorage.getItem(SETTINGS.LANGUAGE);
  settingLanguage.push(appLanguage);
} catch (e) {}
settingLanguage.push(getDefaultLanguage());
settingLanguage.push('en');

const defaultState = {
  isNight: false,
  findingFFmpeg: false,
  loadedLanguages: [...Object.keys(window.i18n_messages), 'en'] || ['en'],
  customWalletServers: [],
  sharedPreferences: {},
  daemonSettings: {},
  daemonStatus: { ffmpeg_status: {} },
  clientSettings: {
    // UX
    [SETTINGS.EMAIL_COLLECTION_ACKNOWLEDGED]: false,
    [SETTINGS.FOLLOWING_ACKNOWLEDGED]: false,
    [SETTINGS.TAGS_ACKNOWLEDGED]: false,
    [SETTINGS.ENABLE_SYNC]: IS_WEB,
    [SETTINGS.ENABLE_PUBLISH_PREVIEW]: true,

    // UI
    [SETTINGS.LANGUAGE]: null,
    [SETTINGS.SEARCH_IN_LANGUAGE]: false,
    [SETTINGS.THEME]: __('dark'),
    [SETTINGS.THEMES]: [__('dark'), __('light')],
    [SETTINGS.HOMEPAGE]: null,
    [SETTINGS.HIDE_SPLASH_ANIMATION]: false,
    [SETTINGS.HIDE_BALANCE]: false,
    [SETTINGS.OS_NOTIFICATIONS_ENABLED]: true,
    [SETTINGS.AUTOMATIC_DARK_MODE_ENABLED]: false,
    [SETTINGS.CLOCK_24H]: false,
    [SETTINGS.TILE_LAYOUT]: true,
    [SETTINGS.VIDEO_THEATER_MODE]: false,
    [SETTINGS.VIDEO_PLAYBACK_RATE]: 1,
    [SETTINGS.DESKTOP_WINDOW_ZOOM]: 1,

    [SETTINGS.DARK_MODE_TIMES]: {
      from: { hour: '21', min: '00', formattedTime: '21:00' },
      to: { hour: '8', min: '00', formattedTime: '8:00' },
    },

    // Purchasing
    [SETTINGS.INSTANT_PURCHASE_ENABLED]: false,
    [SETTINGS.INSTANT_PURCHASE_MAX]: {
      currency: 'LBC',
      amount: 0.1,
    },

    // Content
    [SETTINGS.SHOW_MATURE]: false,
    [SETTINGS.AUTOPLAY_MEDIA]: true,
    [SETTINGS.FLOATING_PLAYER]: true,
    [SETTINGS.AUTO_DOWNLOAD]: true,
    [SETTINGS.HIDE_REPOSTS]: false,
    [SETTINGS.HIDE_SCHEDULED_LIVESTREAMS]: false,

    // OS
    [SETTINGS.AUTO_LAUNCH]: true,
    [SETTINGS.TO_TRAY_WHEN_CLOSED]: true,
  },
};
defaultState.clientSettings[SETTINGS.AUTOPLAY_NEXT] = defaultState.clientSettings[SETTINGS.AUTOPLAY_MEDIA];

reducers[ACTIONS.REHYDRATE] = (state, action) => {
  const { clientSettings } = state;
  if (action && action.payload && action.payload.settings) {
    const persistedSettings = action.payload && action.payload.settings;
    const persistedClientSettings = persistedSettings.clientSettings;
    const newClientSettings = { ...clientSettings, ...persistedClientSettings };
    return Object.assign({}, state, { ...persistedSettings, clientSettings: newClientSettings });
  }
  return Object.assign({}, state, { clientSettings });
};

reducers[ACTIONS.FINDING_FFMPEG_STARTED] = (state) =>
  Object.assign({}, state, {
    findingFFmpeg: true,
  });

reducers[ACTIONS.FINDING_FFMPEG_COMPLETED] = (state) =>
  Object.assign({}, state, {
    findingFFmpeg: false,
  });

reducers[ACTIONS.DAEMON_SETTINGS_RECEIVED] = (state, action) =>
  Object.assign({}, state, {
    daemonSettings: action.data.settings,
  });

reducers[ACTIONS.DAEMON_STATUS_RECEIVED] = (state, action) =>
  Object.assign({}, state, {
    daemonStatus: action.data.status,
  });

reducers[ACTIONS.CLIENT_SETTING_CHANGED] = (state, action) => {
  const { key, value } = action.data;
  const clientSettings = Object.assign({}, state.clientSettings);

  clientSettings[key] = value;

  return Object.assign({}, state, {
    clientSettings,
  });
};

reducers[ACTIONS.UPDATE_IS_NIGHT] = (state) => {
  const { from, to } = state.clientSettings[SETTINGS.DARK_MODE_TIMES];
  const momentNow = moment();
  const startNightMoment = moment(from.formattedTime, 'HH:mm');
  const endNightMoment = moment(to.formattedTime, 'HH:mm');
  const isNight = !(momentNow.isAfter(endNightMoment) && momentNow.isBefore(startNightMoment));

  return Object.assign({}, state, {
    isNight,
  });
};

reducers[ACTIONS.DOWNLOAD_LANGUAGE_SUCCESS] = (state, action) => {
  const { loadedLanguages } = state;
  const { language } = action.data;

  if (language && loadedLanguages && !loadedLanguages.includes(language)) {
    return Object.assign({}, state, {
      loadedLanguages: [...loadedLanguages, language],
    });
  } else {
    return state;
  }
};

reducers[ACTIONS.SHARED_PREFERENCE_SET] = (state, action) => {
  const { key, value } = action.data;
  const sharedPreferences = Object.assign({}, state.sharedPreferences);
  sharedPreferences[key] = value;

  return Object.assign({}, state, {
    sharedPreferences,
  });
};

reducers[ACTIONS.SYNC_CLIENT_SETTINGS] = (state) => {
  const { clientSettings } = state;
  const sharedPreferences = Object.assign({}, state.sharedPreferences);
  const selectedClientSettings = getSubsetFromKeysArray(clientSettings, clientSyncKeys);
  const newSharedPreferences = { ...sharedPreferences, ...selectedClientSettings };
  return Object.assign({}, state, { sharedPreferences: newSharedPreferences });
};

reducers[ACTIONS.USER_STATE_POPULATE] = (state, action) => {
  const { clientSettings: currentClientSettings } = state;
  const { settings: sharedPreferences } = action.data;
  const selectedSettings = sharedPreferences ? getSubsetFromKeysArray(sharedPreferences, clientSyncKeys) : {};
  const mergedClientSettings = { ...currentClientSettings, ...selectedSettings };
  const newSharedPreferences = sharedPreferences || {};

  return Object.assign({}, state, {
    sharedPreferences: newSharedPreferences,
    clientSettings: mergedClientSettings,
  });
};

reducers[ACTIONS.SAVE_CUSTOM_WALLET_SERVERS] = (state, action) => {
  return Object.assign({}, state, { customWalletServers: action.data });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
