/* eslint-disable import/no-commonjs */
import * as ACTIONS from 'constants/action_types';
import * as MODALS from 'constants/modal_types';
import { ipcRenderer, remote } from 'electron';
import {
  Lbry,
  doAuthNavigate,
  doBalanceSubscribe,
  doFetchFileInfosAndPublishedClaims,
} from 'lbry-redux';
import Native from 'native';
import Path from 'path';
import { doFetchRewardedContent } from 'redux/actions/content';
import { doFetchDaemonSettings } from 'redux/actions/settings';
import { doAuthenticate } from 'redux/actions/user';
import { doPause } from 'redux/actions/media';
import {
  selectCurrentModal,
  selectIsUpgradeSkipped,
  selectRemoteVersion,
  selectUpdateUrl,
  selectUpgradeDownloadItem,
  selectUpgradeDownloadPath,
  selectUpgradeFilename,
  selectAutoUpdateDeclined,
} from 'redux/selectors/app';

const { autoUpdater } = remote.require('electron-updater');
const { download } = remote.require('electron-dl');
const Fs = remote.require('fs');
const { lbrySettings: config } = require('package.json');

const CHECK_UPGRADE_INTERVAL = 10 * 60 * 1000;

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

export function doDownloadUpgradeRequested() {
  // This means the user requested an upgrade by clicking the "upgrade" button in the navbar.
  // If on Mac and Windows, we do some new behavior for the auto-update system.
  // This will probably be reorganized once we get auto-update going on Linux and remove
  // the old logic.

  return (dispatch, getState) => {
    const state = getState();

    // Pause video if needed
    dispatch(doPause());

    const autoUpdateDeclined = selectAutoUpdateDeclined(state);

    if (['win32', 'darwin'].includes(process.platform)) { // electron-updater behavior
      if (autoUpdateDeclined) {
        // The user declined an update before, so show the "confirm" dialog
        dispatch({
          type: ACTIONS.OPEN_MODAL,
          data: { modal: MODALS.AUTO_UPDATE_CONFIRM },
        });
      } else {
        // The user was never shown the original update dialog (e.g. because they were
        // watching a video). So show the inital "update downloaded" dialog.
        dispatch({
          type: ACTIONS.OPEN_MODAL,
          data: { modal: MODALS.AUTO_UPDATE_DOWNLOADED },
        });
      }
    } else { // Old behavior for Linux
      dispatch(doDownloadUpgrade());
    }
  };
}

export function doDownloadUpgrade() {
  return (dispatch, getState) => {
    const state = getState();
    // Make a new directory within temp directory so the filename is guaranteed to be available
    const dir = Fs.mkdtempSync(remote.app.getPath('temp') + Path.sep);
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
          path: Path.join(dir, upgradeFilename),
        },
      });
    });

    dispatch({
      type: ACTIONS.UPGRADE_DOWNLOAD_STARTED,
    });
    dispatch({
      type: ACTIONS.OPEN_MODAL,
      data: {
        modal: MODALS.DOWNLOADING,
      },
    });
  };
}

export function doAutoUpdate() {
  return function(dispatch, getState) {
    const state = getState();
    dispatch({
      type: ACTIONS.AUTO_UPDATE_DOWNLOADED,
    });

    dispatch({
      type: ACTIONS.OPEN_MODAL,
      data: { modal: MODALS.AUTO_UPDATE_DOWNLOADED },
    });
  };
}

export function doAutoUpdateDeclined() {
  return function(dispatch, getState) {
    const state = getState();
    dispatch({
      type: ACTIONS.AUTO_UPDATE_DECLINED,
    });
  }
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
        console.error(err);
        // Do nothing
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

    if (["win32", "darwin"].includes(process.platform)) {
      // On Windows and Mac, updates happen silently through
      // electron-updater.
      const autoUpdateDeclined = selectAutoUpdateDeclined(state);

      if (!autoUpdateDeclined) {
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
        !selectCurrentModal(state) &&
        (!selectIsUpgradeSkipped(state) || remoteVersion !== selectRemoteVersion(state))
      ) {
        dispatch({
          type: ACTIONS.OPEN_MODAL,
          data: {
            modal: MODALS.UPGRADE,
          },
        });
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
    const checkUpgradeTimer = setInterval(
      () => dispatch(doCheckUpgradeAvailable()),
      CHECK_UPGRADE_INTERVAL
    );
    dispatch({
      type: ACTIONS.CHECK_UPGRADE_SUBSCRIBE,
      data: { checkUpgradeTimer },
    });
  };
}

export function doCheckDaemonVersion() {
  return dispatch => {
    Lbry.version().then(({ lbrynet_version: lbrynetVersion }) => {
      dispatch({
        type:
          config.lbrynetDaemonVersion === lbrynetVersion
            ? ACTIONS.DAEMON_VERSION_MATCH
            : ACTIONS.DAEMON_VERSION_MISMATCH,
      });
    });
  };
}

export function doAlertError(errorList) {
  return dispatch => {
    dispatch({
      type: ACTIONS.OPEN_MODAL,
      data: {
        modal: MODALS.ERROR,
        modalProps: { error: errorList },
      },
    });
  };
}

export function doDaemonReady() {
  return (dispatch, getState) => {
    const state = getState();

    dispatch(doAuthenticate());
    dispatch({ type: ACTIONS.DAEMON_READY });
    dispatch(doFetchDaemonSettings());
    dispatch(doBalanceSubscribe());
    dispatch(doFetchFileInfosAndPublishedClaims());
    dispatch(doFetchRewardedContent());
    if (!selectIsUpgradeSkipped(state)) {
      dispatch(doCheckUpgradeAvailable());
    }
    dispatch(doCheckUpgradeSubscribe());
  };
}

export function doRemoveSnackBarSnack() {
  return {
    type: ACTIONS.REMOVE_SNACKBAR_SNACK,
  };
}

export function doClearCache() {
  return () => {
    window.cacheStore.purge();

    return Promise.resolve();
  };
}

export function doQuit() {
  return () => {
    remote.app.quit();
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

export function doConditionalAuthNavigate(newSession) {
  return (dispatch, getState) => {
    const state = getState();
    if (newSession || selectCurrentModal(state) !== 'email_collection') {
      dispatch(doAuthNavigate());
    }
  };
}
