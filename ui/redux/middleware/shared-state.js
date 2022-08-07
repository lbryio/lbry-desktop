// @flow
import isEqual from 'util/deep-equal';
import { doPreferenceSet } from 'redux/actions/sync';

const RUN_PREFERENCES_DELAY_MS = 2000;
const SHARED_PREFERENCE_VERSION = '0.1';
let oldShared = {};
let timeout;
export const buildSharedStateMiddleware =
  (actions: Array<string>, sharedStateFilters: {}, sharedStateCb?: (any) => void) =>
  ({ getState, dispatch }: { getState: () => { settings: any }, dispatch: (any) => void }) =>
  (next: ({}) => void) =>
  (action: { type: string, data: any }) => {
    // We don't care if sync is disabled here, we always want to backup preferences to the wallet
    if (!actions.includes(action.type) || typeof action === 'function') {
      return next(action);
    }
    clearTimeout(timeout);
    const actionResult = next(action);
    // Call `getState` after calling `next` to ensure the state has updated in response to the action
    function runPreferences() {
      const nextState: { settings: any } = getState(); // bring in lbrysync
      const syncEnabled =
        nextState.settings && nextState.settings.clientSettings && nextState.settings.clientSettings.enable_sync;
      const signedIn = false; // get from new sync system newsync
      const preferenceKey = syncEnabled && signedIn ? 'shared' : 'local'; // we'll need to migrate for signed in people.
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
        sharedStateCb({ dispatch, getState });
      }
      clearTimeout(timeout);
      return actionResult;
    }
    timeout = setTimeout(runPreferences, RUN_PREFERENCES_DELAY_MS);
  };
