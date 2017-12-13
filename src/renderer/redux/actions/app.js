import * as types from "constants/action_types";
import lbry from "lbry";
import {
  selectUpdateUrl,
  selectUpgradeDownloadPath,
  selectUpgradeDownloadItem,
  selectUpgradeFilename,
  selectIsUpgradeSkipped,
  selectRemoteVersion,
} from "redux/selectors/app";
import { doFetchDaemonSettings } from "redux/actions/settings";
import { doBalanceSubscribe, doFetchTransactions } from "redux/actions/wallet";
import { doAuthenticate } from "redux/actions/user";
import { doFetchFileInfosAndPublishedClaims } from "redux/actions/file_info";
import * as modals from "constants/modal_types";
import { doFetchRewardedContent } from "redux/actions/content";
import { selectCurrentModal } from "redux/selectors/app";

const { remote, ipcRenderer, shell } = require("electron");
const path = require("path");

const { download } = remote.require("electron-dl");
const fs = remote.require("fs");
const { lbrySettings: config } = require("package.json");

const CHECK_UPGRADE_INTERVAL = 10 * 60 * 1000;

export function doOpenModal(modal, modalProps = {}) {
  return {
    type: types.OPEN_MODAL,
    data: {
      modal,
      modalProps,
    },
  };
}

export function doCloseModal() {
  return {
    type: types.CLOSE_MODAL,
  };
}

export function doUpdateDownloadProgress(percent) {
  return {
    type: types.UPGRADE_DOWNLOAD_PROGRESSED,
    data: {
      percent,
    },
  };
}

export function doSkipUpgrade() {
  return {
    type: types.SKIP_UPGRADE,
  };
}

export function doStartUpgrade() {
  return function(dispatch, getState) {
    const state = getState();
    const upgradeDownloadPath = selectUpgradeDownloadPath(state);

    ipcRenderer.send("upgrade", upgradeDownloadPath);
  };
}

export function doDownloadUpgrade() {
  return function(dispatch, getState) {
    const state = getState();
    // Make a new directory within temp directory so the filename is guaranteed to be available
    const dir = fs.mkdtempSync(
        remote.app.getPath("temp") + require("path").sep
      ),
      upgradeFilename = selectUpgradeFilename(state);

    const options = {
      onProgress: p => dispatch(doUpdateDownloadProgress(Math.round(p * 100))),
      directory: dir,
    };
    download(remote.getCurrentWindow(), selectUpdateUrl(state), options).then(
      downloadItem => {
        /**
         * TODO: get the download path directly from the download object. It should just be
         * downloadItem.getSavePath(), but the copy on the main process is being garbage collected
         * too soon.
         */

        dispatch({
          type: types.UPGRADE_DOWNLOAD_COMPLETED,
          data: {
            downloadItem,
            path: path.join(dir, upgradeFilename),
          },
        });
      }
    );

    dispatch({
      type: types.UPGRADE_DOWNLOAD_STARTED,
    });
    dispatch({
      type: types.OPEN_MODAL,
      data: {
        modal: modals.DOWNLOADING,
      },
    });
  };
}

export function doCancelUpgrade() {
  return function(dispatch, getState) {
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

    dispatch({ type: types.UPGRADE_CANCELLED });
  };
}

export function doCheckUpgradeAvailable() {
  return function(dispatch, getState) {
    const state = getState();
    dispatch({
      type: types.CHECK_UPGRADE_START,
    });

    const success = ({ remoteVersion, upgradeAvailable }) => {
      dispatch({
        type: types.CHECK_UPGRADE_SUCCESS,
        data: {
          upgradeAvailable,
          remoteVersion,
        },
      });

      if (
        upgradeAvailable &&
        !selectCurrentModal(state) &&
        (!selectIsUpgradeSkipped(state) ||
          remoteVersion !== selectRemoteVersion(state))
      ) {
        dispatch({
          type: types.OPEN_MODAL,
          data: {
            modal: modals.UPGRADE,
          },
        });
      }
    };

    const fail = () => {
      dispatch({
        type: types.CHECK_UPGRADE_FAIL,
      });
    };

    lbry.getAppVersionInfo().then(success, fail);
  };
}

/*
  Initiate a timer that will check for an app upgrade every 10 minutes.
 */
export function doCheckUpgradeSubscribe() {
  return function(dispatch) {
    const checkUpgradeTimer = setInterval(
      () => dispatch(doCheckUpgradeAvailable()),
      CHECK_UPGRADE_INTERVAL
    );
    dispatch({
      type: types.CHECK_UPGRADE_SUBSCRIBE,
      data: { checkUpgradeTimer },
    });
  };
}

export function doCheckDaemonVersion() {
  return function(dispatch, getState) {
    lbry.version().then(({ lbrynet_version }) => {
      dispatch({
        type:
          config.lbrynetDaemonVersion == lbrynet_version
            ? types.DAEMON_VERSION_MATCH
            : types.DAEMON_VERSION_MISMATCH,
      });
    });
  };
}

export function doAlertError(errorList) {
  return function(dispatch, getState) {
    const state = getState();
    dispatch({
      type: types.OPEN_MODAL,
      data: {
        modal: modals.ERROR,
        modalProps: { error: errorList },
      },
    });
  };
}

export function doDaemonReady() {
  return function(dispatch, getState) {
    const state = getState();

    dispatch(doAuthenticate());
    dispatch({ type: types.DAEMON_READY });
    dispatch(doFetchDaemonSettings());
    dispatch(doBalanceSubscribe());
    dispatch(doFetchFileInfosAndPublishedClaims());
    dispatch(doFetchRewardedContent());
    dispatch(doFetchTransactions(false));
    if (!selectIsUpgradeSkipped(state)) {
      dispatch(doCheckUpgradeAvailable());
    }
    dispatch(doCheckUpgradeSubscribe());
  };
}

export function doShowSnackBar(data) {
  return {
    type: types.SHOW_SNACKBAR,
    data,
  };
}

export function doRemoveSnackBarSnack() {
  return {
    type: types.REMOVE_SNACKBAR_SNACK,
  };
}

export function doClearCache() {
  return function(dispatch, getState) {
    window.cacheStore.purge();

    return Promise.resolve();
  };
}

export function doQuit() {
  return function(dispatch, getState) {
    remote.app.quit();
  };
}

export function doChangeVolume(volume) {
  return function(dispatch, getState) {
    dispatch({
      type: types.VOLUME_CHANGED,
      data: {
        volume,
      },
    });
  };
}
