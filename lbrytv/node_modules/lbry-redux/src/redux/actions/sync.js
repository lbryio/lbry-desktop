// @flow
import * as ACTIONS from 'constants/action_types';
import Lbry from 'lbry';

type SharedData = {
  version: '0.1',
  value: {
    subscriptions?: Array<string>,
    tags?: Array<string>,
    blocked?: Array<string>,
    settings?: any,
    app_welcome_version?: number,
    sharing_3P?: boolean,
  },
};

function extractUserState(rawObj: SharedData) {
  if (rawObj && rawObj.version === '0.1' && rawObj.value) {
    const {
      subscriptions,
      tags,
      blocked,
      settings,
      app_welcome_version,
      sharing_3P,
    } = rawObj.value;

    return {
      ...(subscriptions ? { subscriptions } : {}),
      ...(tags ? { tags } : {}),
      ...(blocked ? { blocked } : {}),
      ...(settings ? { settings } : {}),
      ...(app_welcome_version ? { app_welcome_version } : {}),
      ...(sharing_3P ? { sharing_3P } : {}),
    };
  }

  return {};
}

export function doPopulateSharedUserState(sharedSettings: any) {
  return (dispatch: Dispatch) => {
    const {
      subscriptions,
      tags,
      blocked,
      settings,
      app_welcome_version,
      sharing_3P,
    } = extractUserState(sharedSettings);
    dispatch({
      type: ACTIONS.USER_STATE_POPULATE,
      data: {
        subscriptions,
        tags,
        blocked,
        settings,
        welcomeVersion: app_welcome_version,
        allowAnalytics: sharing_3P,
      },
    });
  };
}

export function doPreferenceSet(
  key: string,
  value: any,
  version: string,
  success: Function,
  fail: Function
) {
  const preference = {
    type: typeof value,
    version,
    value,
  };

  const options = {
    key,
    value: JSON.stringify(preference),
  };

  Lbry.preference_set(options)
    .then(() => {
      success(preference);
    })
    .catch(() => {
      if (fail) {
        fail();
      }
    });
}

export function doPreferenceGet(key: string, success: Function, fail?: Function) {
  const options = {
    key,
  };

  Lbry.preference_get(options)
    .then(result => {
      if (result) {
        const preference = result[key];
        return success(preference);
      }

      return success(null);
    })
    .catch(err => {
      if (fail) {
        fail(err);
      }
    });
}
