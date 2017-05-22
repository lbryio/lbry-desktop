import * as types from 'constants/action_types'
import lbry from 'lbry'
import {
  selectUpdateUrl,
  selectUpgradeDownloadDir,
  selectUpgradeDownloadItem,
  selectUpgradeFilename,
  selectPageTitle,
} from 'selectors/app'

const {remote, ipcRenderer, shell} = require('electron');
const path = require('path');
const app = require('electron').remote.app;
const {download} = remote.require('electron-dl');
const fs = remote.require('fs');

const queryStringFromParams = (params) => {
  return Object
    .keys(params)
    .map(key => `${key}=${params[key]}`)
    .join('&')
}

export function doNavigate(path, params = {}) {
  return function(dispatch, getState) {
    let url = path
    if (params)
      url = `${url}?${queryStringFromParams(params)}`

    dispatch(doChangePath(url))

    const state = getState()
    const pageTitle = selectPageTitle(state)
    dispatch(doHistoryPush(params, pageTitle, url))
  }
}

export function doChangePath(path) {
  return function(dispatch, getState) {
    dispatch({
      type: types.CHANGE_PATH,
      data: {
        path,
      }
    })

    const state = getState()
    const pageTitle = selectPageTitle(state)
    window.document.title = pageTitle
  }
}

export function doHistoryBack() {
  return function(dispatch, getState) {
    history.back()
  }
}

export function doHistoryPush(params, title, relativeUrl) {
  return function(dispatch, getState) {
    let pathParts = window.location.pathname.split('/')
    pathParts[pathParts.length - 1] = relativeUrl.replace(/^\//, '')
    const url = pathParts.join('/')
    title += " - LBRY"
    history.pushState(params, title, url)
  }
}

export function doOpenModal(modal) {
  return {
    type: types.OPEN_MODAL,
    data: {
      modal
    }
  }
}

export function doCloseModal() {
  return {
    type: types.CLOSE_MODAL,
  }
}

export function doUpdateDownloadProgress(percent) {
  return {
    type: types.UPGRADE_DOWNLOAD_PROGRESSED,
    data: {
      percent: percent
    }
  }
}

export function doSkipUpgrade() {
  return {
    type: types.SKIP_UPGRADE
  }
}

export function doStartUpgrade() {
  return function(dispatch, getState) {
    const state = getState()
    const upgradeDownloadPath = selectUpgradeDownloadDir(state)

    ipcRenderer.send('upgrade', upgradeDownloadPath)
  }
}

export function doDownloadUpgrade() {
  return function(dispatch, getState) {
    const state = getState()
    // Make a new directory within temp directory so the filename is guaranteed to be available
    const dir = fs.mkdtempSync(app.getPath('temp') + require('path').sep);
    const upgradeFilename = selectUpgradeFilename(state)

    let options = {
      onProgress: (p) => dispatch(doUpdateDownloadProgress(Math.round(p * 100))),
      directory: dir,
    };
    download(remote.getCurrentWindow(), selectUpdateUrl(state), options)
      .then(downloadItem => {
        /**
         * TODO: get the download path directly from the download object. It should just be
         * downloadItem.getSavePath(), but the copy on the main process is being garbage collected
         * too soon.
         */

        const _upgradeDownloadItem = downloadItem;
        const _upgradeDownloadPath = path.join(dir, upgradeFilename);

        dispatch({
          type: types.UPGRADE_DOWNLOAD_COMPLETED,
          data: {
            dir,
            downloadItem
          }
        })
      });

    dispatch({
      type: types.UPGRADE_DOWNLOAD_STARTED
    })
    dispatch({
      type: types.OPEN_MODAL,
      data: {
        modal: 'downloading'
      }
    })
  }
}

export function doCancelUpgrade() {
  return function(dispatch, getState) {
    const state = getState()
    const upgradeDownloadItem = selectUpgradeDownloadItem(state)

    if (upgradeDownloadItem) {
      /*
       * Right now the remote reference to the download item gets garbage collected as soon as the
       * the download is over (maybe even earlier), so trying to cancel a finished download may
       * throw an error.
       */
      try {
        upgradeDownloadItem.cancel();
      } catch (err) {
        console.error(err)
        // Do nothing
      }
    }

    dispatch({ type: types.UPGRADE_CANCELLED })
  }
}

export function doCheckUpgradeAvailable() {
  return function(dispatch, getState) {
    const state = getState()

    lbry.getVersionInfo().then(({remoteVersion, upgradeAvailable}) => {
      if (upgradeAvailable) {
        dispatch({
          type: types.UPDATE_VERSION,
          data: {
            version: remoteVersion,
          }
        })
        dispatch({
          type: types.OPEN_MODAL,
          data: {
            modal: 'upgrade'
          }
        })
      }
    });
  }
}

export function doAlertError(errorList) {
  return function(dispatch, getState) {
    const state = getState()

    dispatch({
      type: types.OPEN_MODAL,
      data: {
        modal: 'error',
        error: errorList
      }
    })
  }
}

export function doDaemonReady() {
  return {
    type: types.DAEMON_READY
  }
}
