// @if TARGET='app'
import { execSync } from 'child_process';
import isDev from 'electron-is-dev';
import { ipcRenderer, remote } from 'electron';
// @endif
import path from 'path';
import * as ACTIONS from 'constants/action_types';
import * as MODALS from 'constants/modal_types';
import * as PAGES from 'constants/pages';
import {
  Lbry,
  doBalanceSubscribe,
  doFetchFileInfosAndPublishedClaims,
  doError,
  makeSelectClaimForUri,
  makeSelectClaimIsMine,
  doPopulateSharedUserState,
  doFetchChannelListMine,
  doClearPublish,
  doPreferenceGet,
  doToast,
} from 'lbry-redux';
import Native from 'native';
import { doFetchDaemonSettings } from 'redux/actions/settings';
import {
  selectIsUpgradeSkipped,
  selectUpdateUrl,
  selectUpgradeDownloadItem,
  selectUpgradeDownloadPath,
  selectUpgradeFilename,
  selectAutoUpdateDeclined,
  selectRemoteVersion,
  selectUpgradeTimer,
  selectModal,
} from 'redux/selectors/app';
import { doAuthenticate, doGetSync, doResetSync } from 'lbryinc';
import { lbrySettings as config, version as appVersion } from 'package.json';
import { push } from 'connected-react-router';
import analytics from 'analytics';
import { deleteAuthToken, getSavedPassword, getAuthToken } from 'util/saved-passwords';

// @if TARGET='app'
const { autoUpdater } = remote.require('electron-updater');
const { download } = remote.require('electron-dl');
const Fs = remote.require('fs');
// @endif

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
    // @if TARGET='app'
    const state = getState();
    // Make a new directory within temp directory so the filename is guaranteed to be available
    const dir = Fs.mkdtempSync(remote.app.getPath('temp') + path.sep);
    const upgradeFilename = selectUpgradeFilename(state);

    const options = {
      onProgress: p => dispatch(doUpdateDownloadProgress(Math.round(p * 100))),
      directory: dir,
    };
    download(remote.getCurrentWindow(), selectUpdateUrl(state), options).then(downloadItem => {
      /**
       * TODO: get the download path directly from the download object. It should just be
       * downloadItem.getSavePath(), but the copy on the main process is being garbage collected
       * too soon.
       */

      dispatch({
        type: ACTIONS.UPGRADE_DOWNLOAD_COMPLETED,
        data: {
          downloadItem,
          path: path.join(dir, upgradeFilename),
        },
      });
    });

    dispatch({
      type: ACTIONS.UPGRADE_DOWNLOAD_STARTED,
    });
    dispatch(doHideModal());
    dispatch(doOpenModal(MODALS.DOWNLOADING));
    // @endif
  };
}

export function doDownloadUpgradeRequested() {
  // This means the user requested an upgrade by clicking the "upgrade" button in the navbar.
  // If on Mac and Windows, we do some new behavior for the auto-update system.
  // This will probably be reorganized once we get auto-update going on Linux and remove
  // the old logic.

  return dispatch => {
    if (['win32', 'darwin'].includes(process.platform)) {
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
  return dispatch => {
    dispatch({
      type: ACTIONS.AUTO_UPDATE_DOWNLOADED,
    });

    dispatch(doOpenModal(MODALS.AUTO_UPDATE_DOWNLOADED));

    dispatch(doClearUpgradeTimer());
  };
}

export function doAutoUpdateDeclined() {
  return dispatch => {
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

    if (['win32', 'darwin'].includes(process.platform)) {
      // On Windows and Mac, updates happen silently through
      // electron-updater.
      const autoUpdateDeclined = selectAutoUpdateDeclined(state);

      if (!autoUpdateDeclined && !isDev) {
        autoUpdater.checkForUpdates();
      }
      return;
    }

    const success = ({ remoteVersion, upgradeAvailable }) => {
      dispatch({
        type: ACTIONS.CHECK_UPGRADE_SUCCESS,
        data: {
          upgradeAvailable,
          remoteVersion,
        },
      });

      if (
        upgradeAvailable &&
        !selectModal(state) &&
        (!selectIsUpgradeSkipped(state) || remoteVersion !== selectRemoteVersion(state))
      ) {
        dispatch(doOpenModal(MODALS.UPGRADE));
      }
    };

    const fail = () => {
      dispatch({
        type: ACTIONS.CHECK_UPGRADE_FAIL,
      });
    };

    Native.getAppVersionInfo().then(success, fail);
  };
}

/*
  Initiate a timer that will check for an app upgrade every 10 minutes.
 */
export function doCheckUpgradeSubscribe() {
  return dispatch => {
    const checkUpgradeTimer = setInterval(() => dispatch(doCheckUpgradeAvailable()), CHECK_UPGRADE_INTERVAL);
    dispatch({
      type: ACTIONS.CHECK_UPGRADE_SUBSCRIBE,
      data: { checkUpgradeTimer },
    });
  };
}

export function doCheckDaemonVersion() {
  return dispatch => {
    // @if TARGET='app'
    Lbry.version().then(({ lbrynet_version: lbrynetVersion }) => {
      // Avoid the incompatible daemon modal if running in dev mode
      // Lets you  run a different daemon than the one specified in package.json
      if (config.lbrynetDaemonVersion === lbrynetVersion) {
        return dispatch({
          type: ACTIONS.DAEMON_VERSION_MATCH,
        });
      }

      dispatch({
        type: ACTIONS.DAEMON_VERSION_MISMATCH,
      });

      return dispatch(doOpenModal(MODALS.INCOMPATIBLE_DAEMON));
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
  return dispatch => {
    dispatch(doOpenModal(MODALS.WALLET_ENCRYPT));
  };
}

export function doNotifyDecryptWallet() {
  return dispatch => {
    dispatch(doOpenModal(MODALS.WALLET_DECRYPT));
  };
}

export function doNotifyUnlockWallet() {
  return dispatch => {
    dispatch(doOpenModal(MODALS.WALLET_UNLOCK));
  };
}

export function doNotifyForgetPassword(props) {
  return dispatch => {
    dispatch(doOpenModal(MODALS.WALLET_PASSWORD_UNSAVE, props));
  };
}

export function doAlertError(errorList) {
  return dispatch => {
    dispatch(doError(errorList));
  };
}

export function doDaemonReady() {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(doAuthenticate(appVersion));
    dispatch({ type: ACTIONS.DAEMON_READY });

    // @if TARGET='app'
    dispatch(doBalanceSubscribe());
    dispatch(doFetchDaemonSettings());
    dispatch(doFetchFileInfosAndPublishedClaims());
    if (!selectIsUpgradeSkipped(state)) {
      dispatch(doCheckUpgradeAvailable());
    }
    dispatch(doCheckUpgradeSubscribe());
    // @endif
  };
}

export function doClearCache() {
  return dispatch => {
    // Need to update this to work with new version of redux-persist
    // Leaving for now
    // const reducersToClear = whiteListedReducers.filter(reducerKey => reducerKey !== 'tags');
    // window.cacheStore.purge(reducersToClear);
    window.localStorage.clear();
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
  return dispatch => {
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
  return dispatch => {
    dispatch({
      type: ACTIONS.VOLUME_CHANGED,
      data: {
        volume,
      },
    });
  };
}

export function doChangeMute(muted) {
  return dispatch => {
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

export function doConditionalAuthNavigate(newSession) {
  return (dispatch, getState) => {
    const state = getState();
    const modal = selectModal(state);

    if (newSession || (modal && modal.id !== MODALS.EMAIL_COLLECTION)) {
      dispatch(push(`/$/${PAGES.AUTH}`));
    }
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
    const { txid, nout, claim_id: claimId } = makeSelectClaimForUri(uri)(state);
    const claimIsMine = makeSelectClaimIsMine(uri)(state);
    const outpoint = `${txid}:${nout}`;

    if (claimIsMine) {
      return Promise.resolve();
    }

    return analytics.apiLogView(uri, outpoint, claimId, timeToStart);
  };
}

export function doSignIn() {
  return (dispatch, getState) => {
    // @if TARGET='web'
    const authToken = getAuthToken();
    Lbry.setApiHeader('X-Lbry-Auth-Token', authToken);
    dispatch(doBalanceSubscribe());
    dispatch(doFetchChannelListMine());
    // @endif
  };
}

export function doSignOut() {
  return dispatch => {
    deleteAuthToken()
      .then(() => {
        // @if TARGET='web'
        window.persistor.purge();
        // @endif
        // @if TARGET='app'
        return dispatch(doResetSync());
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

export function doSyncWithPreferences() {
  return dispatch => {
    function handleSyncComplete() {
      dispatch(doFetchChannelListMine());

      function successCb(savedPreferences) {
        if (savedPreferences !== null) {
          dispatch(doPopulateSharedUserState(savedPreferences));
        }
      }

      function failCb() {
        dispatch(
          doToast({
            isError: true,
            message: __('Unable to load your saved preferences.'),
          })
        );
      }

      doPreferenceGet('shared', successCb, failCb);
    }

    return getSavedPassword().then(password => {
      const passwordArgument = password === null ? '' : password;

      dispatch(doGetSync(passwordArgument, handleSyncComplete));
    });
  };
}
