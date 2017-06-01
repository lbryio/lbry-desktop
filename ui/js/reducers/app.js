import * as types from 'constants/action_types'
import lbry from 'lbry'

const reducers = {}
const defaultState = {
  isLoaded: false,
  currentPath: 'discover',
  platform: process.platform,
  upgradeSkipped: sessionStorage.getItem('upgradeSkipped'),
  daemonReady: false,
  obscureNsfw: !lbry.getClientSetting('showNsfw'),
  hasSignature: false,
}

reducers[types.DAEMON_READY] = function(state, action) {
  return Object.assign({}, state, {
    daemonReady: true,
  })
}

reducers[types.CHANGE_PATH] = function(state, action) {
  return Object.assign({}, state, {
    currentPath: action.data.path,
  })
}

reducers[types.UPGRADE_CANCELLED] = function(state, action) {
  return Object.assign({}, state, {
    downloadProgress: null,
    upgradeDownloadComplete: false,
    modal: null,
  })
}

reducers[types.UPGRADE_DOWNLOAD_COMPLETED] = function(state, action) {
  return Object.assign({}, state, {
    downloadPath: action.data.path,
    upgradeDownloading: false,
    upgradeDownloadCompleted: true
  })
}

reducers[types.UPGRADE_DOWNLOAD_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    upgradeDownloading: true
  })
}

reducers[types.SKIP_UPGRADE] = function(state, action) {
  sessionStorage.setItem('upgradeSkipped', true);

  return Object.assign({}, state, {
    upgradeSkipped: true,
    modal: null
  })
}

reducers[types.UPDATE_VERSION] = function(state, action) {
  return Object.assign({}, state, {
    version: action.data.version
  })
}

reducers[types.OPEN_MODAL] = function(state, action) {
  return Object.assign({}, state, {
    modal: action.data.modal,
    modalExtraContent: action.data.extraContent
  })
}

reducers[types.CLOSE_MODAL] = function(state, action) {
  return Object.assign({}, state, {
    modal: undefined,
    modalExtraContent: undefined
  })
}

reducers[types.UPGRADE_DOWNLOAD_PROGRESSED] = function(state, action) {
  return Object.assign({}, state, {
    downloadProgress: action.data.percent
  })
}

reducers[types.DAEMON_READY] = function(state, action) {
  return Object.assign({}, state, {
    daemonReady: true
  })
}

reducers[types.SHOW_SNACKBAR] = function(state, action) {
  const {
    message,
    linkText,
    linkTarget,
    isError,
  } = action.data
  const snackBar = Object.assign({}, state.snackBar)
  const snacks = Object.assign([], snackBar.snacks)
  snacks.push({
    message,
    linkText,
    linkTarget,
    isError,
  })
  const newSnackBar = Object.assign({}, snackBar, {
    snacks,
  })

  return Object.assign({}, state, {
    snackBar: newSnackBar,
  })
}

reducers[types.REMOVE_SNACKBAR_SNACK] = function(state, action) {
  const snackBar = Object.assign({}, state.snackBar)
  const snacks = Object.assign([], snackBar.snacks)
  snacks.shift()

  const newSnackBar = Object.assign({}, snackBar, {
    snacks,
  })

  return Object.assign({}, state, {
    snackBar: newSnackBar,
  })
}

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
