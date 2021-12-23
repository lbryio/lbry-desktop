// @flow
import * as ACTIONS from 'constants/action_types';
import isEqual from 'util/deep-equal';
import { doPreferenceSet } from 'redux/actions/sync';

const RUN_PREFERENCES_DELAY_MS = 2000;
const SHARED_PREFERENCE_VERSION = '0.1';
let oldShared = {};
let timeout;
export const buildSharedStateMiddleware = (
  actions: Array<string>,
  sharedStateFilters: {},
  sharedStateCb?: (any) => void
) => ({ getState, dispatch }: { getState: () => { user: any, settings: any }, dispatch: (any) => void }) => (
  next: ({}) => void
) => (action: { type: string, data: any }) => {
  // We don't care if sync is disabled here, we always want to backup preferences to the wallet
  if (!actions.includes(action.type) || typeof action === 'function') {
    return next(action);
  }
  clearTimeout(timeout);
  const actionResult = next(action);
  // Call `getState` after calling `next` to ensure the state has updated in response to the action
  function runPreferences() {
    const nextState: { user: any, settings: any } = getState();
    const syncEnabled =
      nextState.settings && nextState.settings.clientSettings && nextState.settings.clientSettings.enable_sync;
    const hasVerifiedEmail = nextState.user && nextState.user.user && nextState.user.user.has_verified_email;
    const preferenceKey = syncEnabled && hasVerifiedEmail ? 'shared' : 'local';
    const shared = {};

    Object.keys(sharedStateFilters).forEach((key) => {
      const filter = sharedStateFilters[key];
      const { source, property, transform } = filter;
      let value = nextState[source][property];
      if (transform) {
        value = transform(value);
      }

      shared[key] = value;
    });

    if (!isEqual(oldShared, shared)) {
      // only update if the preference changed from last call in the same session
      oldShared = shared;
      dispatch(doPreferenceSet(preferenceKey, shared, SHARED_PREFERENCE_VERSION));
    }

    if (sharedStateCb) {
      // Pass dispatch to the callback to consumers can dispatch actions in response to preference set
      sharedStateCb({ dispatch, getState, syncId: timeout });
    }
    clearTimeout(timeout);
    return actionResult;
  }

  timeout = setTimeout(runPreferences, RUN_PREFERENCES_DELAY_MS);
  dispatch({ type: ACTIONS.SHARED_STATE_SYNC_ID_CHANGED, data: timeout });
};
