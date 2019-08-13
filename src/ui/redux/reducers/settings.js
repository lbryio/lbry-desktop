import * as ACTIONS from 'constants/action_types';
import LANGUAGES from 'constants/languages';
import * as SETTINGS from 'constants/settings';

function getLocalStorageSetting(setting, fallback) {
  const localStorageVal = localStorage.getItem(`setting_${setting}`);
  return localStorageVal === null ? fallback : JSON.parse(localStorageVal);
}

const reducers = {};
const defaultState = {
  clientSettings: {
    [SETTINGS.INSTANT_PURCHASE_ENABLED]: getLocalStorageSetting(SETTINGS.INSTANT_PURCHASE_ENABLED, false),
    [SETTINGS.INSTANT_PURCHASE_MAX]: getLocalStorageSetting(SETTINGS.INSTANT_PURCHASE_MAX, {
      currency: 'LBC',
      amount: 0.1,
    }),
    [SETTINGS.SHOW_NSFW]: getLocalStorageSetting(SETTINGS.SHOW_NSFW, false),
    [SETTINGS.SHOW_UNAVAILABLE]: getLocalStorageSetting(SETTINGS.SHOW_UNAVAILABLE, true),
    [SETTINGS.NEW_USER_ACKNOWLEDGED]: getLocalStorageSetting(SETTINGS.NEW_USER_ACKNOWLEDGED, false),
    [SETTINGS.EMAIL_COLLECTION_ACKNOWLEDGED]: getLocalStorageSetting(SETTINGS.EMAIL_COLLECTION_ACKNOWLEDGED, false),
    [SETTINGS.CREDIT_REQUIRED_ACKNOWLEDGED]: false, // this needs to be re-acknowledged every run
    [SETTINGS.LANGUAGE]: getLocalStorageSetting(SETTINGS.LANGUAGE, 'en'),
    [SETTINGS.THEME]: getLocalStorageSetting(SETTINGS.THEME, 'light'),
    [SETTINGS.THEMES]: getLocalStorageSetting(SETTINGS.THEMES, []),
    [SETTINGS.AUTOMATIC_DARK_MODE_ENABLED]: getLocalStorageSetting(SETTINGS.AUTOMATIC_DARK_MODE_ENABLED, false),
    [SETTINGS.SUPPORT_OPTION]: getLocalStorageSetting(SETTINGS.SUPPORT_OPTION, false),
    [SETTINGS.AUTOPLAY]: getLocalStorageSetting(SETTINGS.AUTOPLAY, true),
    [SETTINGS.RESULT_COUNT]: Number(getLocalStorageSetting(SETTINGS.RESULT_COUNT, 50)),
    [SETTINGS.AUTO_DOWNLOAD]: getLocalStorageSetting(SETTINGS.AUTO_DOWNLOAD, true),
    [SETTINGS.OS_NOTIFICATIONS_ENABLED]: Boolean(getLocalStorageSetting(SETTINGS.OS_NOTIFICATIONS_ENABLED, true)),
    [SETTINGS.HIDE_BALANCE]: Boolean(getLocalStorageSetting(SETTINGS.HIDE_BALANCE, false)),
    [SETTINGS.HIDE_SPLASH_ANIMATION]: Boolean(getLocalStorageSetting(SETTINGS.HIDE_SPLASH_ANIMATION, false)),
    [SETTINGS.FLOATING_PLAYER]: Boolean(getLocalStorageSetting(SETTINGS.FLOATING_PLAYER, true)),
  },
  isNight: false,
  languages: { en: 'English', pl: 'Polish', id: 'Bahasa Indonesia' }, // temporarily hard code these so we can advance i18n testing
  daemonSettings: {},
};

reducers[ACTIONS.DAEMON_SETTINGS_RECEIVED] = (state, action) =>
  Object.assign({}, state, {
    daemonSettings: action.data.settings,
  });

reducers[ACTIONS.CLIENT_SETTING_CHANGED] = (state, action) => {
  const { key, value } = action.data;
  const clientSettings = Object.assign({}, state.clientSettings);

  clientSettings[key] = value;

  // this technically probably shouldn't happen here, and should be fixed when we're no longer using localStorage at all for persistent app state
  // @if TARGET='app'
  localStorage.setItem(`setting_${key}`, JSON.stringify(value));
  // @endif

  return Object.assign({}, state, {
    clientSettings,
  });
};

reducers[ACTIONS.UPDATE_IS_NIGHT] = (state, action) =>
  Object.assign({}, state, {
    isNight: action.data.isNight,
  });

reducers[ACTIONS.DOWNLOAD_LANGUAGE_SUCCEEDED] = (state, action) => {
  const languages = Object.assign({}, state.languages);
  const { language } = action.data;

  const langCode = language.substring(0, 2);

  if (LANGUAGES[langCode]) {
    languages[language] = `${LANGUAGES[langCode][0]} (${LANGUAGES[langCode][1]})`;
  } else {
    languages[langCode] = langCode;
  }

  return Object.assign({}, state, { languages });
};

reducers[ACTIONS.DOWNLOAD_LANGUAGE_FAILED] = (state, action) => {
  const languages = Object.assign({}, state.languages);
  delete languages[action.data.language];
  return Object.assign({}, state, { languages });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
