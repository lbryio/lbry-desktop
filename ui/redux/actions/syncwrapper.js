// @flow
import { doGetSync, selectGetSyncIsPending, selectSetSyncIsPending } from 'lbryinc';
import { selectWalletIsEncrypted, SETTINGS } from 'lbry-redux';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doSetClientSetting, doPushSettingsToPrefs } from 'redux/actions/settings';
import { doToast } from 'redux/actions/notifications';

export const doGetSyncDesktop = (pw: string, cb: () => void) => (dispatch: Dispatch, getState: () => {}) => {
  const state = getState();
  const syncEnabled = makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state);
  const getSyncPending = selectGetSyncIsPending(state);
  const setSyncPending = selectSetSyncIsPending(state);
  const walletIsEncrypted = selectWalletIsEncrypted(state);
  // const { pathname } = state.router && state.router.location;
  // const isSettingsPage = pathname.includes(PAGES.SETTINGS);

  if (syncEnabled && !getSyncPending && !setSyncPending) {
    if (walletIsEncrypted && pw === '') {
      dispatch(doSetClientSetting(SETTINGS.ENABLE_SYNC, false));
      dispatch(doPushSettingsToPrefs());
      dispatch(
        doToast({
          message: 'Something is wrong with your wallet encryption. Disabling remote sync for now.',
          isError: true,
        })
      );
    } else {
      dispatch(doGetSync(pw, cb));
    }
  }
};
