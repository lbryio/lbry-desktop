// @flow
import { doGetSync, selectGetSyncIsPending, selectSetSyncIsPending } from 'lbryinc';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { SETTINGS } from 'lbry-redux';

export const doGetSyncDesktop = (pw: string, cb: () => void) => (dispatch: Dispatch, getState: () => {}) => {
  const state = getState();
  const syncEnabled = makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state);
  const getSyncPending = selectGetSyncIsPending(state);
  const setSyncPending = selectSetSyncIsPending(state);

  if (syncEnabled && !getSyncPending && !setSyncPending) {
    dispatch(doGetSync(pw, cb));
  }
};
