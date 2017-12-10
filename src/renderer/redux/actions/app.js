/* eslint-disable import/no-commonjs */
import * as ACTIONS from 'constants/action_types';
import * as MODALS from 'constants/modal_types';
import { ipcRenderer, remote } from 'electron';
import Lbry from 'lbry';
import Path from 'path';
import { doFetchRewardedContent } from 'redux/actions/content';
import { doFetchFileInfosAndPublishedClaims } from 'redux/actions/file_info';
import { doAuthNavigate } from 'redux/actions/navigation';
import { doFetchDaemonSettings } from 'redux/actions/settings';
import { doAuthenticate } from 'redux/actions/user';
import { doBalanceSubscribe } from 'redux/actions/wallet';
import {
  selectCurrentModal,
  selectIsUpgradeSkipped,
  selectRemoteVersion,
  selectUpdateUrl,
  selectUpgradeDownloadItem,
  selectUpgradeDownloadPath,
  selectUpgradeFilename,
} from 'redux/selectors/app';

const { autoUpdater } = remote.require('electron-updater');
const { download } = remote.require('electron-dl');
const Fs = remote.require('fs');
const { lbrySettings: config } = require('package.json');

const CHECK_UPGRADE_INTERVAL = 10 * 60 * 1000;

export function doOpenModal(modal, modalProps = {}) {
  return {
    type: ACTIONS.OPEN_MODAL,
    data: {
      modal,
      modalProps,
    },
  };
}

export function doCloseModal() {
  return {
    type: ACTIONS.CLOSE_MODAL,
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
      type: types.OPEN_MODAL,
      data: { modal: modals.AUTO_UPDATE_DOWNLOADED },
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
      // On Windows and Mac, updates happen silently
      autoUpdater.checkForUpdates();
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

    Lbry.getAppVersionInfo().then(success, fail);
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

export function doShowSnackBar(data) {
  return {
    type: ACTIONS.SHOW_SNACKBAR,
    data,
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
