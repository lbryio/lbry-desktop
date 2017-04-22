import * as types from 'constants/action_types'

const reducers = {}
const defaultState = {
  isLoaded: false,
  currentPage: 'discover',
  platform: process.platform,
  drawerOpen: sessionStorage.getItem('drawerOpen') || true,
  upgradeSkipped: sessionStorage.getItem('upgradeSkipped'),
  daemonReady: false,
}

reducers[types.NAVIGATE] = function(state, action) {
  return Object.assign({}, state, {
    currentPage: action.data.path
  })
}

reducers[types.UPGRADE_CANCELLED] = function(state, action) {
  return Object.assign({}, state, {
    downloadProgress: null,
    downloadComplete: false,
    modal: null,
  })
}

reducers[types.UPGRADE_DOWNLOAD_COMPLETED] = function(state, action) {
  return Object.assign({}, state, {
    downloadDir: action.data.dir,
    downloadComplete: true,
  })
}

reducers[types.UPGRADE_DOWNLOAD_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    upgradeDownloading: true
  })
}

reducers[types.UPGRADE_DOWNLOAD_COMPLETED] = function(state, action) {
  return Object.assign({}, state, {
    upgradeDownloading: false,
    upgradeDownloadCompleted: true
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
    extraContent: action.data.errorList
  })
}

reducers[types.CLOSE_MODAL] = function(state, action) {
  return Object.assign({}, state, {
    modal: undefined,
    extraContent: undefined
  })
}

reducers[types.OPEN_DRAWER] = function(state, action) {
  sessionStorage.setItem('drawerOpen', false)
  return Object.assign({}, state, {
    drawerOpen: true
  })
}

reducers[types.CLOSE_DRAWER] = function(state, action) {
  sessionStorage.setItem('drawerOpen', false)
  return Object.assign({}, state, {
    drawerOpen: false
  })
}

reducers[types.UPGRADE_DOWNLOAD_PROGRESSED] = function(state, action) {
  return Object.assign({}, state, {
    downloadProgress: action.data.percent
  })
}

reducers[types.DAEMON_READY] = function(state, action) {
  // sessionStorage.setItem('loaded', 'y');
  return Object.assign({}, state, {
    daemonReady: true
  })
}

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
