import * as types from "constants/action_types";
import * as settings from "constants/settings";
import LANGUAGES from "constants/languages";

function getLocalStorageSetting(setting, fallback) {
  var localStorageVal = localStorage.getItem("setting_" + setting);
  return localStorageVal === null ? fallback : JSON.parse(localStorageVal);
}

const reducers = {};
const defaultState = {
  clientSettings: {
    instantPurchaseEnabled: getLocalStorageSetting(
      settings.INSTANT_PURCHASE_ENABLED,
      false
    ),
    instantPurchaseMax: getLocalStorageSetting(settings.INSTANT_PURCHASE_MAX, {
      currency: "LBC",
      amount: 0.1,
    }),
    showNsfw: getLocalStorageSetting(settings.SHOW_NSFW, false),
    showUnavailable: getLocalStorageSetting(settings.SHOW_UNAVAILABLE, true),
    welcome_acknowledged: getLocalStorageSetting(
      settings.NEW_USER_ACKNOWLEDGED,
      false
    ),
    email_collection_acknowledged: getLocalStorageSetting(
      settings.EMAIL_COLLECTION_ACKNOWLEDGED
    ),
    credit_required_acknowledged: false, //this needs to be re-acknowledged every run
    language: getLocalStorageSetting(settings.LANGUAGE, "en"),
    theme: getLocalStorageSetting(settings.THEME, "light"),
    themes: getLocalStorageSetting(settings.THEMES, []),
  },
  languages: {},
};

reducers[types.DAEMON_SETTINGS_RECEIVED] = function(state, action) {
  return Object.assign({}, state, {
    daemonSettings: action.data.settings,
  });
};

reducers[types.CLIENT_SETTING_CHANGED] = function(state, action) {
  const { key, value } = action.data;
  const clientSettings = Object.assign({}, state.clientSettings);

  clientSettings[key] = value;

  //this technically probably shouldn't happen here, and should be fixed when we're no longer using localStorage at all for persistent app state
  localStorage.setItem("setting_" + key, JSON.stringify(value));

  return Object.assign({}, state, {
    clientSettings,
  });
};

reducers[types.DOWNLOAD_LANGUAGE_SUCCEEDED] = function(state, action) {
  const languages = Object.assign({}, state.languages);
  const language = action.data.language;

  const langCode = language.substring(0, 2);

  if (LANGUAGES[langCode]) {
    languages[language] =
      LANGUAGES[langCode][0] + " (" + LANGUAGES[langCode][1] + ")";
  } else {
    languages[langCode] = langCode;
  }

  return Object.assign({}, state, { languages });
};

reducers[types.DOWNLOAD_LANGUAGE_FAILED] = function(state, action) {
  const languages = Object.assign({}, state.languages);
  delete languages[action.data.language];
  return Object.assign({}, state, { languages });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
