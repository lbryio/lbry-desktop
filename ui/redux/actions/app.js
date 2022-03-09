import { execSync } from 'child_process';
import isDev from 'electron-is-dev';
import { ipcRenderer } from 'electron';
import * as remote from '@electron/remote';
import * as ACTIONS from 'constants/action_types';
import * as MODALS from 'constants/modal_types';
import * as SETTINGS from 'constants/settings';
import * as DAEMON_SETTINGS from 'constants/daemon_settings';
import * as SHARED_PREFERENCES from 'constants/shared_preferences';
import { DOMAIN } from 'config';
import Lbry from 'lbry';
import { doFetchChannelListMine, doFetchCollectionListMine, doCheckPendingClaims } from 'redux/actions/claims';
import { selectClaimForUri, selectClaimIsMineForUri, selectMyChannelClaims } from 'redux/selectors/claims';
import { doFetchFileInfos } from 'redux/actions/file_info';
import { doClearSupport, doBalanceSubscribe } from 'redux/actions/wallet';
import { doClearPublish } from 'redux/actions/publish';
import { Lbryio } from 'lbryinc';
import { selectFollowedTagsList } from 'redux/selectors/tags';
import { doToast, doError, doNotificationList } from 'redux/actions/notifications';

import {
  doFetchDaemonSettings,
  doSetAutoLaunch,
  doSetDaemonSetting,
  doFindFFmpeg,
  doGetDaemonStatus,
} from 'redux/actions/settings';
import {
  selectIsUpgradeSkipped,
  selectUpdateUrl,
  selectUpgradeDownloadItem,
  selectUpgradeDownloadPath,
  selectAutoUpdateDeclined,
  selectRemoteVersion,
  selectUpgradeTimer,
  selectModal,
  selectAllowAnalytics,
} from 'redux/selectors/app';
import { selectDaemonSettings, makeSelectClientSetting, selectDisableAutoUpdates } from 'redux/selectors/settings';
import { selectUser } from 'redux/selectors/user';
import { doSyncLoop, doSetPrefsReady, doPreferenceGet, doPopulateSharedUserState } from 'redux/actions/sync';
import { doAuthenticate } from 'redux/actions/user';
import { lbrySettings as config, version as appVersion } from 'package.json';
import analytics, { SHARE_INTERNAL } from 'analytics';
import { doSignOutCleanup } from 'util/saved-passwords';
import { doNotificationSocketConnect } from 'redux/actions/websocket';
import { stringifyServerParam, shouldSetSetting } from 'util/sync-settings';

const CHECK_UPGRADE_INTERVAL = 10 * 60 * 1000;

export function doOpenModal(id, modalProps = {}) {
  return {
    type: ACTIONS.SHOW_MODAL,
    data: {
      id,
      modalProps,
    },
  };
}

export function doHideModal() {
  return {
    type: ACTIONS.HIDE_MODAL,
  };
}

export function doUpdateDownloadProgress(percent) {
  return {
    type: ACTIONS.UPGRADE_DOWNLOAD_PROGRESSED,
    data: {
      percent,
    },
  };
}

export function doSkipUpgrade() {
  return {
    type: ACTIONS.SKIP_UPGRADE,
  };
}

export function doStartUpgrade() {
  return (dispatch, getState) => {
    const state = getState();
    const upgradeDownloadPath = selectUpgradeDownloadPath(state);

    ipcRenderer.send('upgrade', upgradeDownloadPath);
  };
}

export function doDownloadUpgrade() {
  return (dispatch, getState) => {
    const state = getState();
    const url = selectUpdateUrl(state);
    ipcRenderer.send('download-upgrade', { url, options: {} });
    dispatch({
      type: ACTIONS.UPGRADE_DOWNLOAD_STARTED,
    });
    dispatch(doHideModal());
    dispatch(doOpenModal(MODALS.DOWNLOADING));
  };
}

export function doDownloadUpgradeRequested() {
  // This means the user requested an upgrade by clicking the "upgrade" button in the navbar.
  // If on Mac and Windows, we do some new behavior for the auto-update system.
  // This will probably be reorganized once we get auto-update going on Linux and remove
  // the old logic.

  return (dispatch) => {
    if (['win32', 'darwin'].includes(process.platform) || !!process.env.APPIMAGE) {
      // electron-updater behavior
      dispatch(doOpenModal(MODALS.AUTO_UPDATE_DOWNLOADED));
    } else {
      // Old behavior for Linux
      dispatch(doDownloadUpgrade());
    }
  };
}

export function doClearUpgradeTimer() {
  return (dispatch, getState) => {
    const state = getState();

    if (selectUpgradeTimer(state)) {
      clearInterval(selectUpgradeTimer(state));
      dispatch({
        type: ACTIONS.CLEAR_UPGRADE_TIMER,
      });
    }
  };
}

export function doAutoUpdate() {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.AUTO_UPDATE_DOWNLOADED,
    });

    dispatch(doOpenModal(MODALS.AUTO_UPDATE_DOWNLOADED));

    dispatch(doClearUpgradeTimer());
  };
}

export function doAutoUpdateDeclined() {
  return (dispatch) => {
    dispatch(doClearUpgradeTimer());

    dispatch({
      type: ACTIONS.AUTO_UPDATE_DECLINED,
    });
  };
}

export function doCancelUpgrade() {
  return (dispatch, getState) => {
    const state = getState();
    const upgradeDownloadItem = selectUpgradeDownloadItem(state);

    if (upgradeDownloadItem) {
      /*
       * Right now the remote reference to the download item gets garbage collected as soon as the
       * the download is over (maybe even earlier), so trying to cancel a finished download may
       * throw an error.
       */
      try {
        upgradeDownloadItem.cancel();
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      }
    }

    dispatch({ type: ACTIONS.UPGRADE_CANCELLED });
  };
}

export function doCheckUpgradeAvailable() {
  return (dispatch, getState) => {
    const state = getState();
    dispatch({
      type: ACTIONS.CHECK_UPGRADE_START,
    });

    const autoUpdateSupported = ['win32', 'darwin'].includes(process.platform) || !!process.env.APPIMAGE;

    const autoUpdateDeclined = selectAutoUpdateDeclined(state);

    // If auto update isn't supported (Linux using .deb packages)
    // don't perform any download, just get the upgrade info
    // (release notes and version)
    const disableAutoUpdate = !autoUpdateSupported || selectDisableAutoUpdates(state);

    if (autoUpdateDeclined || isDev) {
      return;
    }

    ipcRenderer.send('check-for-updates', !disableAutoUpdate);
  };
}

export function doNotifyUpdateAvailable(e) {
  return (dispatch, getState) => {
    const remoteVersion = e.releaseName || e.version;

    const state = getState();
    const noModalBeingDisplayed = !selectModal(state);
    const isUpgradeSkipped = selectIsUpgradeSkipped(state);
    const isRemoteVersionDiff = remoteVersion !== selectRemoteVersion(state);

    dispatch({
      type: ACTIONS.CHECK_UPGRADE_SUCCESS,
      data: {
        upgradeAvailable: true,
        remoteVersion,
        releaseNotes: e.releaseNotes,
      },
    });

    const autoUpdateSupported = ['win32', 'darwin'].includes(process.platform) || !!process.env.APPIMAGE;

    if (autoUpdateSupported) {
      return;
    }

    if (noModalBeingDisplayed && !isUpgradeSkipped && isRemoteVersionDiff) {
      dispatch(doOpenModal(MODALS.UPGRADE));
    }
  };
}

/*
  Initiate a timer that will check for an app upgrade every 10 minutes.
 */
export function doCheckUpgradeSubscribe() {
  return (dispatch) => {
    const checkUpgradeTimer = setInterval(() => dispatch(doCheckUpgradeAvailable()), CHECK_UPGRADE_INTERVAL);
    dispatch({
      type: ACTIONS.CHECK_UPGRADE_SUBSCRIBE,
      data: { checkUpgradeTimer },
    });
  };
}

export function doCheckDaemonVersion() {
  return (dispatch) => {
    // @if TARGET='app'
    Lbry.version().then(({ lbrynet_version: lbrynetVersion }) => {
      // Avoid the incompatible daemon modal if running in dev mode
      // Lets you  run a different daemon than the one specified in package.json
      if (config.lbrynetDaemonVersion === lbrynetVersion || process.env.NODE_ENV !== 'production') {
        return dispatch({
          type: ACTIONS.DAEMON_VERSION_MATCH,
        });
      }

      dispatch({
        type: ACTIONS.DAEMON_VERSION_MISMATCH,
      });
      if (process.env.NODE_ENV === 'production') {
        return dispatch(doOpenModal(MODALS.INCOMPATIBLE_DAEMON));
      }
    });
    // @endif
    // @if TARGET='web'
    dispatch({
      type: ACTIONS.DAEMON_VERSION_MATCH,
    });
    // @endif
  };
}

export function doNotifyEncryptWallet() {
  return (dispatch) => {
    dispatch(doOpenModal(MODALS.WALLET_ENCRYPT));
  };
}

export function doNotifyDecryptWallet() {
  return (dispatch) => {
    dispatch(doOpenModal(MODALS.WALLET_DECRYPT));
  };
}

export function doNotifyUnlockWallet() {
  return (dispatch) => {
    dispatch(doOpenModal(MODALS.WALLET_UNLOCK));
  };
}

export function doNotifyForgetPassword(props) {
  return (dispatch) => {
    dispatch(doOpenModal(MODALS.WALLET_PASSWORD_UNSAVE, props));
  };
}

export function doAlertError(errorList) {
  return (dispatch) => {
    dispatch(doError(errorList));
  };
}

export function doAlertWaitingForSync() {
  return (dispatch) => {
    dispatch(
      doToast({
        message: __('Please wait a bit, we are still getting your account ready.'),
        isError: false,
      })
    );
  };
}

export function doDaemonReady() {
  return (dispatch, getState) => {
    const state = getState();

    // TODO: call doFetchDaemonSettings, then get usage data, and call doAuthenticate once they are loaded into the store
    const shareUsageData = window.localStorage.getItem(SHARE_INTERNAL) === 'true';

    dispatch(
      doAuthenticate(
        appVersion,
        undefined,
        undefined,
        shareUsageData,
        (status) => {
          const trendingAlgorithm =
            status &&
            status.wallet &&
            status.wallet.connected_features &&
            status.wallet.connected_features.trending_algorithm;

          if (trendingAlgorithm) {
            analytics.trendingAlgorithmEvent(trendingAlgorithm);
          }
        },
        undefined,
        DOMAIN
      )
    );
    dispatch({ type: ACTIONS.DAEMON_READY });

    // @if TARGET='app'
    dispatch(doBalanceSubscribe());
    dispatch(doSetAutoLaunch());
    dispatch(doFindFFmpeg());
    dispatch(doGetDaemonStatus());
    dispatch(doFetchDaemonSettings());
    dispatch(doFetchFileInfos());
    if (!selectIsUpgradeSkipped(state)) {
      dispatch(doCheckUpgradeAvailable());
    }
    dispatch(doCheckUpgradeSubscribe());
    // @endif
  };
}

export function doClearCache() {
  return (dispatch) => {
    // Need to update this to work with new version of redux-persist
    // Leaving for now
    // const reducersToClear = whiteListedReducers.filter(reducerKey => reducerKey !== 'tags');
    // window.cacheStore.purge(reducersToClear);
    window.sessionStorage.clear();
    dispatch(doClearSupport());
    window.location.reload();
    return dispatch(doClearPublish());
  };
}

export function doQuit() {
  return () => {
    // @if TARGET='app'
    remote.app.quit();
    // @endif
  };
}

export function doQuitAnyDaemon() {
  return (dispatch) => {
    // @if TARGET='app'
    Lbry.stop()
      .catch(() => {
        try {
          if (process.platform === 'win32') {
            execSync('taskkill /im lbrynet.exe /t /f');
          } else {
            execSync('pkill lbrynet');
          }
        } catch (error) {
          dispatch(doAlertError(`Quitting daemon failed due to: ${error.message}`));
        }
      })
      .finally(() => {
        dispatch(doQuit());
      });
    // @endif
  };
}

export function doChangeVolume(volume) {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.VOLUME_CHANGED,
      data: {
        volume,
      },
    });
  };
}

export function doChangeMute(muted) {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.VOLUME_MUTED,
      data: {
        muted,
      },
    });
  };
}

export function doClickCommentButton() {
  return {
    type: ACTIONS.ADD_COMMENT,
  };
}

export function doToggleSearchExpanded() {
  return {
    type: ACTIONS.TOGGLE_SEARCH_EXPANDED,
  };
}

export function doAnalyticsView(uri, timeToStart) {
  return (dispatch, getState) => {
    const state = getState();
    const claim = selectClaimForUri(state, uri);
    const { txid, nout, claim_id: claimId } = claim;
    const claimIsMine = selectClaimIsMineForUri(state, claim);
    const outpoint = `${txid}:${nout}`;

    if (claimIsMine) {
      return Promise.resolve();
    }

    return analytics.apiLogView(uri, outpoint, claimId, timeToStart);
  };
}

export function doAnalyticsBuffer(uri, bufferData) {
  return (dispatch, getState) => {
    const state = getState();
    const claim = selectClaimForUri(state, uri);
    const user = selectUser(state);
    const {
      value: { video, audio, source },
    } = claim;
    const timeAtBuffer = parseInt(bufferData.currentTime ? bufferData.currentTime * 1000 : 0);
    const bufferDuration = parseInt(bufferData.secondsToLoad ? bufferData.secondsToLoad * 1000 : 0);
    const fileDurationInSeconds = (video && video.duration) || (audio && audio.duration);
    const fileSize = source.size; // size in bytes
    const fileSizeInBits = fileSize * 8;
    const bitRate = parseInt(fileSizeInBits / fileDurationInSeconds);
    const userId = user && user.id.toString();
    // if there's a logged in user, send buffer event data to watchman
    if (userId) {
      analytics.videoBufferEvent(claim, {
        timeAtBuffer,
        bufferDuration,
        bitRate,
        userId,
        duration: fileDurationInSeconds,
        playerPoweredBy: bufferData.playerPoweredBy,
        readyState: bufferData.readyState,
      });
    }
  };
}

export function doAnalyticsTagSync() {
  return (dispatch, getState) => {
    const state = getState();
    const tags = selectFollowedTagsList(state);
    const stringOfTags = tags.join(',');
    if (stringOfTags) {
      analytics.apiSyncTags({ content_tags: stringOfTags });
    }
  };
}

export function doAnaltyicsPurchaseEvent(fileInfo) {
  return () => {
    let purchasePrice = fileInfo.purchase_receipt && fileInfo.purchase_receipt.amount;
    if (purchasePrice) {
      const purchaseInt = Number(Number(purchasePrice).toFixed(0));
      analytics.purchaseEvent(purchaseInt);
    }
  };
}

export function doSignIn() {
  return (dispatch, getState) => {
    const state = getState();
    const user = selectUser(state);
    const notificationsEnabled = user.experimental_ui;

    dispatch(doNotificationSocketConnect(notificationsEnabled));

    if (notificationsEnabled) {
      dispatch(doNotificationList());
    }
    dispatch(doCheckPendingClaims());

    // @if TARGET='web'
    dispatch(doBalanceSubscribe());
    dispatch(doFetchChannelListMine());
    dispatch(doFetchCollectionListMine());
    // @endif
  };
}

export function doSignOut() {
  return () => {
    Lbryio.call('user', 'signout')
      .then(doSignOutCleanup)
      .then(() => {
        // @if TARGET='web'
        window.persistor.purge();
        // @endif
      })
      .then(() => {
        setTimeout(() => {
          location.reload();
        });
      })
      .catch(() => location.reload());
  };
}

export function doSetWelcomeVersion(version) {
  return {
    type: ACTIONS.SET_WELCOME_VERSION,
    data: version,
  };
}

export function doSetHasNavigated() {
  return {
    type: ACTIONS.SET_HAS_NAVIGATED,
    data: true,
  };
}

export function doToggle3PAnalytics(allowParam, doNotDispatch) {
  return (dispatch, getState) => {
    const state = getState();
    const allowState = selectAllowAnalytics(state);
    const allow = allowParam !== undefined && allowParam !== null ? allowParam : allowState;
    analytics.toggleThirdParty(allow);
    if (!doNotDispatch) {
      return dispatch({
        type: ACTIONS.SET_ALLOW_ANALYTICS,
        data: allow,
      });
    }
  };
}

export function doGetAndPopulatePreferences() {
  const { SDK_SYNC_KEYS } = SHARED_PREFERENCES;

  return (dispatch, getState) => {
    const state = getState();
    const syncEnabled = makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state);
    const hasVerifiedEmail = state.user && state.user.user && state.user.user.has_verified_email;
    let preferenceKey;
    preferenceKey = syncEnabled && hasVerifiedEmail ? 'shared' : 'local';

    function successCb(savedPreferences) {
      const successState = getState();
      const daemonSettings = selectDaemonSettings(successState);
      if (savedPreferences !== null) {
        dispatch(doPopulateSharedUserState(savedPreferences));

        const { settings } = savedPreferences.value;
        if (settings) {
          Object.entries(settings).forEach(([key, val]) => {
            if (SDK_SYNC_KEYS.includes(key)) {
              if (shouldSetSetting(key, val, daemonSettings[key])) {
                if (key === DAEMON_SETTINGS.LBRYUM_SERVERS) {
                  const servers = stringifyServerParam(val);
                  dispatch(doSetDaemonSetting(key, servers, true));
                } else {
                  dispatch(doSetDaemonSetting(key, val, true));
                }
              }
            }
            // probably set commentServer here instead of in doPopulateSharedUserState()
          });
        }
      } else {
        dispatch(doSetPrefsReady());
      }
      return true;
    }

    function failCb(er) {
      dispatch(
        doToast({
          isError: true,
          message: __('Unable to load your saved preferences.'),
        })
      );

      dispatch({
        type: ACTIONS.SYNC_FATAL_ERROR,
        error: er,
      });

      return false;
    }

    return dispatch(doPreferenceGet(preferenceKey, successCb, failCb));
  };
}

export function doHandleSyncComplete(error, hasNewData) {
  return (dispatch) => {
    if (!error) {
      if (hasNewData) {
        dispatch(doGetAndPopulatePreferences());
        // we just got sync data, better update our channels
        dispatch(doFetchChannelListMine());
      }
    } else {
      console.error('Error in doHandleSyncComplete', error);
    }
  };
}

export function doSyncWithPreferences() {
  return (dispatch) => dispatch(doSyncLoop());
}

export function doToggleInterestedInYoutubeSync() {
  return {
    type: ACTIONS.TOGGLE_YOUTUBE_SYNC_INTEREST,
  };
}

export function doToggleSplashAnimation() {
  return {
    type: ACTIONS.TOGGLE_SPLASH_ANIMATION,
  };
}

export function doSetActiveChannel(claimId) {
  return (dispatch, getState) => {
    if (claimId) {
      return dispatch({
        type: ACTIONS.SET_ACTIVE_CHANNEL,
        data: {
          claimId,
        },
      });
    }

    // If no claimId is passed, set the active channel to the one with the highest effective_amount
    const state = getState();
    const myChannelClaims = selectMyChannelClaims(state);

    if (!myChannelClaims || !myChannelClaims.length) {
      return;
    }

    const myChannelClaimsByEffectiveAmount = myChannelClaims.slice().sort((a, b) => {
      const effectiveAmountA = (a.meta && Number(a.meta.effective_amount)) || 0;
      const effectiveAmountB = (b.meta && Number(b.meta.effective_amount)) || 0;
      if (effectiveAmountA === effectiveAmountB) {
        return 0;
      } else if (effectiveAmountA > effectiveAmountB) {
        return -1;
      } else {
        return 1;
      }
    });

    const newActiveChannelClaim = myChannelClaimsByEffectiveAmount[0];

    dispatch({
      type: ACTIONS.SET_ACTIVE_CHANNEL,
      data: {
        claimId: newActiveChannelClaim.claim_id,
      },
    });
  };
}

export function doSetIncognito(incognitoEnabled) {
  return {
    type: ACTIONS.SET_INCOGNITO,
    data: {
      enabled: incognitoEnabled,
    },
  };
}
