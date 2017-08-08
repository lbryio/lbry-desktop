import * as types from "constants/action_types";
import lbry from "lbry";

const reducers = {};
const defaultState = {
  clientSettings: {
    showNsfw: lbry.getClientSetting("showNsfw"),
    language: lbry.getClientSetting("language"),
  },
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

  return Object.assign({}, state, {
    clientSettings,
  });
};

reducers[types.DOWNLOAD_LANGUAGE_SUCCEEDED] = function(state, action) {
  const localLanguages = [].concat(
    state.localLanguages ? state.localLanguages : []
  );
  const language = action.data;
  if (localLanguages.indexOf(language) === -1) {
    localLanguages.push(language);
  }

  return Object.assign({}, state, {
    localLanguages,
  });
};

reducers[types.LANGUAGE_RESOLVED] = function(state, action) {
  const { key, value } = action.data;
  const resolvedLanguages = Object.assign({}, state.resolvedLanguages);

  resolvedLanguages[key] = value;

  return Object.assign({}, state, {
    resolvedLanguages,
  });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
