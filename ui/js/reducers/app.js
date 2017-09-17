import * as types from "constants/action_types";
import * as modalTypes from "constants/modal_types";

const { remote } = require("electron");
const application = remote.app;
const win = remote.BrowserWindow.getFocusedWindow();

const reducers = {};
const defaultState = {
  isLoaded: false,
  modal: null,
  modalProps: {},
  platform: process.platform,
  upgradeSkipped: sessionStorage.getItem("upgradeSkipped"),
  daemonVersionMatched: null,
  daemonReady: false,
  hasSignature: false,
  badgeNumber: 0,
  volume: sessionStorage.getItem("volume") || 1,
};

reducers[types.DAEMON_READY] = function(state, action) {
  return Object.assign({}, state, {
    daemonReady: true,
  });
};

reducers[types.DAEMON_VERSION_MATCH] = function(state, action) {
  return Object.assign({}, state, {
    daemonVersionMatched: true,
  });
};

reducers[types.DAEMON_VERSION_MISMATCH] = function(state, action) {
  return Object.assign({}, state, {
    daemonVersionMatched: false,
    modal: modalTypes.INCOMPATIBLE_DAEMON,
  });
};

reducers[types.UPGRADE_CANCELLED] = function(state, action) {
  return Object.assign({}, state, {
    downloadProgress: null,
    upgradeDownloadComplete: false,
    modal: null,
  });
};

reducers[types.UPGRADE_DOWNLOAD_COMPLETED] = function(state, action) {
  return Object.assign({}, state, {
    downloadPath: action.data.path,
    upgradeDownloading: false,
    upgradeDownloadCompleted: true,
  });
};

reducers[types.UPGRADE_DOWNLOAD_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    upgradeDownloading: true,
  });
};

reducers[types.SKIP_UPGRADE] = function(state, action) {
  sessionStorage.setItem("upgradeSkipped", true);

  return Object.assign({}, state, {
    upgradeSkipped: true,
    modal: null,
  });
};

reducers[types.UPDATE_VERSION] = function(state, action) {
  return Object.assign({}, state, {
    version: action.data.version,
  });
};

reducers[types.OPEN_MODAL] = function(state, action) {
  return Object.assign({}, state, {
    modal: action.data.modal,
    modalProps: action.data.modalProps || {},
  });
};

reducers[types.CLOSE_MODAL] = function(state, action) {
  return Object.assign({}, state, {
    modal: undefined,
    modalProps: {},
  });
};

reducers[types.UPGRADE_DOWNLOAD_PROGRESSED] = function(state, action) {
  return Object.assign({}, state, {
    downloadProgress: action.data.percent,
  });
};

reducers[types.SHOW_SNACKBAR] = function(state, action) {
  const { message, linkText, linkTarget, isError } = action.data;
  const snackBar = Object.assign({}, state.snackBar);
  const snacks = Object.assign([], snackBar.snacks);
  snacks.push({
    message,
    linkText,
    linkTarget,
    isError,
  });
  const newSnackBar = Object.assign({}, snackBar, {
    snacks,
  });

  return Object.assign({}, state, {
    snackBar: newSnackBar,
  });
};

reducers[types.REMOVE_SNACKBAR_SNACK] = function(state, action) {
  const snackBar = Object.assign({}, state.snackBar);
  const snacks = Object.assign([], snackBar.snacks);
  snacks.shift();

  const newSnackBar = Object.assign({}, snackBar, {
    snacks,
  });

  return Object.assign({}, state, {
    snackBar: newSnackBar,
  });
};

reducers[types.DOWNLOADING_COMPLETED] = function(state, action) {
  const badgeNumber = state.badgeNumber;

  // Don't update the badge number if the window is focused
  if (win.isFocused()) return Object.assign({}, state);

  return Object.assign({}, state, {
    badgeNumber: badgeNumber + 1,
  });
};

reducers[types.WINDOW_FOCUSED] = function(state, action) {
  return Object.assign({}, state, {
    badgeNumber: 0,
  });
};

reducers[types.VOLUME_CHANGED] = function(state, action) {
  return Object.assign({}, state, {
    volume: action.data.volume,
  });
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
