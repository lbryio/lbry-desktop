import * as types from "constants/action_types";
import lbry from "lbry";

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
  lbry.setClientSetting(key, value);

  return {
    type: types.CLIENT_SETTING_CHANGED,
    data: {
      key,
      value,
    },
  };
}
