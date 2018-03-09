// @flow

import * as ACTIONS from 'constants/action_types';
import * as MODALS from 'constants/modal_types';

import { remote } from 'electron';

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
  autoUpdateDeclined: boolean,
  modalsAllowed: boolean,
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
  autoUpdateDownloaded: false,
  autoUpdateDeclined: false,
  modalsAllowed: true,

  downloadProgress: undefined,
  upgradeDownloading: undefined,
  upgradeDownloadComplete: undefined,
  checkUpgradeTimer: undefined,
  isUpgradeAvailable: undefined,
  isUpgradeSkipped: undefined,
  snackBar: undefined,
};

reducers[ACTIONS.DAEMON_READY] = state =>
  Object.assign({}, state, {
    daemonReady: true,
  });

reducers[ACTIONS.DAEMON_VERSION_MATCH] = state =>
  Object.assign({}, state, {
    daemonVersionMatched: true,
  });

reducers[ACTIONS.DAEMON_VERSION_MISMATCH] = state =>
  Object.assign({}, state, {
    daemonVersionMatched: false,
    modal: MODALS.INCOMPATIBLE_DAEMON,
  });

reducers[ACTIONS.UPGRADE_CANCELLED] = state =>
  Object.assign({}, state, {
    downloadProgress: null,
    upgradeDownloadComplete: false,
    modal: null,
  });

reducers[ACTIONS.AUTO_UPDATE_DOWNLOADED] = state =>
  Object.assign({}, state, {
    autoUpdateDownloaded: true,
  });

reducers[ACTIONS.AUTO_UPDATE_DECLINED] = state => {
  return Object.assign({}, state, {
    autoUpdateDeclined: true,
  });
};

reducers[ACTIONS.UPGRADE_DOWNLOAD_COMPLETED] = (state, action) =>
  Object.assign({}, state, {
    downloadPath: action.data.path,
    upgradeDownloading: false,
    upgradeDownloadCompleted: true,
  });

reducers[ACTIONS.UPGRADE_DOWNLOAD_STARTED] = state =>
  Object.assign({}, state, {
    upgradeDownloading: true,
  });

reducers[ACTIONS.CHANGE_MODALS_ALLOWED] = (state, action) =>
  Object.assign({}, state, {
    modalsAllowed: action.data.modalsAllowed,
  });

reducers[ACTIONS.SKIP_UPGRADE] = state => {
  sessionStorage.setItem('upgradeSkipped', 'true');

  return Object.assign({}, state, {
    isUpgradeSkipped: true,
    modal: null,
  });
};

reducers[ACTIONS.MEDIA_PLAY] = state => {
  return Object.assign({}, state, {
    modalsAllowed: false,
  });
};

reducers[ACTIONS.MEDIA_PAUSE] = state => {
  return Object.assign({}, state, {
    modalsAllowed: true,
  });
};

reducers[ACTIONS.SET_PLAYING_URI] = (state, action) => {
  if (action.data.uri === null) {
    return Object.assign({}, state, {
      modalsAllowed: true,
    });
  } else {
    return state;
  }
};

reducers[ACTIONS.UPDATE_VERSION] = (state, action) =>
  Object.assign({}, state, {
    version: action.data.version,
  });

reducers[ACTIONS.CHECK_UPGRADE_SUCCESS] = (state, action) =>
  Object.assign({}, state, {
    isUpgradeAvailable: action.data.upgradeAvailable,
    remoteVersion: action.data.remoteVersion,
  });

reducers[ACTIONS.CHECK_UPGRADE_SUBSCRIBE] = (state, action) =>
  Object.assign({}, state, {
    checkUpgradeTimer: action.data.checkUpgradeTimer,
  });

reducers[ACTIONS.OPEN_MODAL] = (state, action) => {
  if (!state.modalsAllowed) {
    return state;
  } else {
    return Object.assign({}, state, {
      modal: action.data.modal,
      modalProps: action.data.modalProps || {},
    });
  }
};
reducers[ACTIONS.CLOSE_MODAL] = state =>
  Object.assign({}, state, {
    modal: undefined,
    modalProps: {},
  });

reducers[ACTIONS.UPGRADE_DOWNLOAD_PROGRESSED] = (state, action) =>
  Object.assign({}, state, {
    downloadProgress: action.data.percent,
  });

reducers[ACTIONS.SHOW_SNACKBAR] = (state, action) => {
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

reducers[ACTIONS.REMOVE_SNACKBAR_SNACK] = state => {
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

reducers[ACTIONS.DOWNLOADING_COMPLETED] = state => {
  const { badgeNumber } = state;

  // Don't update the badge number if the window is focused
  if (win && win.isFocused()) return Object.assign({}, state);

  return Object.assign({}, state, {
    badgeNumber: badgeNumber + 1,
  });
};

reducers[ACTIONS.WINDOW_FOCUSED] = state =>
  Object.assign({}, state, {
    badgeNumber: 0,
  });

reducers[ACTIONS.VOLUME_CHANGED] = (state, action) =>
  Object.assign({}, state, {
    volume: action.data.volume,
  });

reducers[ACTIONS.HISTORY_NAVIGATE] = state =>
  Object.assign({}, state, {
    modal: undefined,
    modalProps: {},
  });

export default function reducer(state: AppState = defaultState, action: any) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
