import * as ACTIONS from 'constants/action_types';
import LANGUAGES from 'constants/languages';
import * as SETTINGS from 'constants/settings';
import moment from 'moment';

const reducers = {};
const defaultState = {
  isNight: false,
  languages: { en: 'English', pl: 'Polish', id: 'Bahasa Indonesia', de: 'German' }, // temporarily hard code these so we can advance i18n testing
  daemonSettings: {},
  clientSettings: {
    // UX
    [SETTINGS.NEW_USER_ACKNOWLEDGED]: false,
    [SETTINGS.EMAIL_COLLECTION_ACKNOWLEDGED]: false,

    // UI
    [SETTINGS.LANGUAGE]: 'en',
    [SETTINGS.THEME]: 'light',
    [SETTINGS.THEMES]: [],
    [SETTINGS.SUPPORT_OPTION]: false,
    [SETTINGS.HIDE_SPLASH_ANIMATION]: false,
    [SETTINGS.HIDE_BALANCE]: false,
    [SETTINGS.OS_NOTIFICATIONS_ENABLED]: true,
    [SETTINGS.AUTOMATIC_DARK_MODE_ENABLED]: false,
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
    [SETTINGS.AUTOPLAY]: true,
    [SETTINGS.FLOATING_PLAYER]: true,
    [SETTINGS.AUTO_DOWNLOAD]: true,
  },
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

reducers[ACTIONS.UPDATE_IS_NIGHT] = state => {
  const { from, to } = state.clientSettings[SETTINGS.DARK_MODE_TIMES];
  const momentNow = moment();
  const startNightMoment = moment(from.formattedTime, 'HH:mm');
  const endNightMoment = moment(to.formattedTime, 'HH:mm');
  const isNight = !(momentNow.isAfter(endNightMoment) && momentNow.isBefore(startNightMoment));

  return Object.assign({}, state, {
    isNight,
  });
};

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
