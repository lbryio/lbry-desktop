// @flow

import * as ACTIONS from 'constants/action_types';
import * as MODALS from 'constants/modal_types';

const { remote } = require('electron');

const win = remote.BrowserWindow.getFocusedWindow();

const reducers = {};

export type SnackBar = {
  message: string,
  linkText: string,
  linkTarget: string,
  isError: boolean,
};
export type AppState = {
  isLoaded: boolean,
  modal: ?string,
  modalProps: mixed,
  platform: string,
  upgradeSkipped: boolean,
  daemonVersionMatched: ?boolean,
  daemonReady: boolean,
  hasSignature: boolean,
  badgeNumber: number,
  volume: number,
  downloadProgress: ?number,
  upgradeDownloading: ?boolean,
  upgradeDownloadComplete: ?boolean,
  checkUpgradeTimer: ?number,
  isUpgradeAvailable: ?boolean,
  isUpgradeSkipped: ?boolean,
  snackBar: ?SnackBar,
};

const defaultState: AppState = {
  isLoaded: false,
  modal: null,
  modalProps: {},
  platform: process.platform,
  upgradeSkipped: sessionStorage.getItem('upgradeSkipped') === 'true',
  daemonVersionMatched: null,
  daemonReady: false,
  hasSignature: false,
  badgeNumber: 0,
  volume: Number(sessionStorage.getItem('volume')) || 1,

  downloadProgress: undefined,
  upgradeDownloading: undefined,
  upgradeDownloadComplete: undefined,
  checkUpgradeTimer: undefined,
  isUpgradeAvailable: undefined,
  isUpgradeSkipped: undefined,
  snackBar: undefined,
};

reducers[ACTIONS.DAEMON_READY] = function(state) {
  return Object.assign({}, state, {
    daemonReady: true,
  });
};

reducers[ACTIONS.DAEMON_VERSION_MATCH] = function(state) {
  return Object.assign({}, state, {
    daemonVersionMatched: true,
  });
};

reducers[ACTIONS.DAEMON_VERSION_MISMATCH] = function(state) {
  return Object.assign({}, state, {
    daemonVersionMatched: false,
    modal: MODALS.INCOMPATIBLE_DAEMON,
  });
};

reducers[ACTIONS.UPGRADE_CANCELLED] = function(state) {
  return Object.assign({}, state, {
    downloadProgress: null,
    upgradeDownloadComplete: false,
    modal: null,
  });
};

reducers[ACTIONS.UPGRADE_DOWNLOAD_COMPLETED] = function(state, action) {
  return Object.assign({}, state, {
    downloadPath: action.data.path,
    upgradeDownloading: false,
    upgradeDownloadCompleted: true,
  });
};

reducers[ACTIONS.UPGRADE_DOWNLOAD_STARTED] = function(state) {
  return Object.assign({}, state, {
    upgradeDownloading: true,
  });
};

reducers[ACTIONS.SKIP_UPGRADE] = function(state) {
  sessionStorage.setItem('upgradeSkipped', 'true');

  return Object.assign({}, state, {
    isUpgradeSkipped: true,
    modal: null,
  });
};

reducers[ACTIONS.UPDATE_VERSION] = function(state, action) {
  return Object.assign({}, state, {
    version: action.data.version,
  });
};

reducers[ACTIONS.CHECK_UPGRADE_SUCCESS] = function(state, action) {
  return Object.assign({}, state, {
    isUpgradeAvailable: action.data.upgradeAvailable,
    remoteVersion: action.data.remoteVersion,
  });
};

reducers[ACTIONS.CHECK_UPGRADE_SUBSCRIBE] = function(state, action) {
  return Object.assign({}, state, {
    checkUpgradeTimer: action.data.checkUpgradeTimer,
  });
};

reducers[ACTIONS.OPEN_MODAL] = function(state, action) {
  return Object.assign({}, state, {
    modal: action.data.modal,
    modalProps: action.data.modalProps || {},
  });
};

reducers[ACTIONS.CLOSE_MODAL] = function(state) {
  return Object.assign({}, state, {
    modal: undefined,
    modalProps: {},
  });
};

reducers[ACTIONS.UPGRADE_DOWNLOAD_PROGRESSED] = function(state, action) {
  return Object.assign({}, state, {
    downloadProgress: action.data.percent,
  });
};

reducers[ACTIONS.SHOW_SNACKBAR] = function(state, action) {
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

reducers[ACTIONS.REMOVE_SNACKBAR_SNACK] = function(state) {
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

reducers[ACTIONS.DOWNLOADING_COMPLETED] = function(state) {
  const { badgeNumber } = state;

  // Don't update the badge number if the window is focused
  if (win && win.isFocused()) return Object.assign({}, state);

  return Object.assign({}, state, {
    badgeNumber: badgeNumber + 1,
  });
};

reducers[ACTIONS.WINDOW_FOCUSED] = function(state) {
  return Object.assign({}, state, {
    badgeNumber: 0,
  });
};

reducers[ACTIONS.VOLUME_CHANGED] = function(state, action) {
  return Object.assign({}, state, {
    volume: action.data.volume,
  });
};

export default function reducer(state: AppState = defaultState, action: any) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
