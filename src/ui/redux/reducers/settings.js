import * as ACTIONS from 'constants/action_types';
import * as SETTINGS from 'constants/settings';
import moment from 'moment';

const reducers = {};
const defaultState = {
  isNight: false,
  isFetchingLanguage: false,
  daemonSettings: {},
  clientSettings: {
    // UX
    [SETTINGS.NEW_USER_ACKNOWLEDGED]: false,
    [SETTINGS.EMAIL_COLLECTION_ACKNOWLEDGED]: false,
    [SETTINGS.ENABLE_SYNC]: false,

    // UI
    [SETTINGS.LANGUAGE]: window.localStorage.getItem(SETTINGS.LANGUAGE) || 'en',
    [SETTINGS.THEME]: __('light'),
    [SETTINGS.THEMES]: [__('light'), __('dark')],
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

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
