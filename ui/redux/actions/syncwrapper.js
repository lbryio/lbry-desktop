// @flow
import { doGetSync } from 'redux/actions/sync';
import { selectGetSyncIsPending, selectSetSyncIsPending } from 'redux/selectors/sync';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { getSavedPassword } from 'util/saved-passwords';
import { doAnalyticsTagSync, doHandleSyncComplete } from 'redux/actions/app';
import { selectSyncIsLocked } from 'redux/selectors/app';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { SETTINGS } from 'lbry-redux';

let syncTimer = null;
const SYNC_INTERVAL = 1000 * 60 * 5; // 5 minutes

export const doGetSyncDesktop = (cb?: () => void, password?: string) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const syncEnabled = makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state);
  const getSyncPending = selectGetSyncIsPending(state);
  const setSyncPending = selectSetSyncIsPending(state);
  const syncLocked = selectSyncIsLocked(state);

  return getSavedPassword().then(savedPassword => {
    const passwordArgument = password || password === '' ? password : savedPassword === null ? '' : savedPassword;

    if (syncEnabled && !getSyncPending && !setSyncPending && !syncLocked) {
      return dispatch(doGetSync(passwordArgument, cb));
    }
  });
};

export function doSyncSubscribe() {
  return (dispatch: Dispatch, getState: GetState) => {
    if (syncTimer) clearInterval(syncTimer);
    const state = getState();
    const hasVerifiedEmail = selectUserVerifiedEmail(state);
    const syncEnabled = makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state);
    const syncLocked = selectSyncIsLocked(state);
    if (hasVerifiedEmail && syncEnabled && !syncLocked) {
      dispatch(doGetSyncDesktop((error, hasNewData) => dispatch(doHandleSyncComplete(error, hasNewData))));
      dispatch(doAnalyticsTagSync());
      syncTimer = setInterval(() => {
        const state = getState();
        const syncEnabled = makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state);
        if (syncEnabled) {
          dispatch(doGetSyncDesktop((error, hasNewData) => dispatch(doHandleSyncComplete(error, hasNewData))));
          dispatch(doAnalyticsTagSync());
        }
      }, SYNC_INTERVAL);
    }
  };
}

export function doSyncUnsubscribe() {
  return (dispatch: Dispatch) => {
    if (syncTimer) {
      clearInterval(syncTimer);
    }
  };
}
