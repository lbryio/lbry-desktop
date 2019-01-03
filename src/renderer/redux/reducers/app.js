// @flow

import * as ACTIONS from 'constants/action_types';
import * as MODALS from 'constants/modal_types';
// @if TARGET='app'
import { remote } from 'electron';
// @endif
// @if TARGET='web'
import { remote } from '../../../web/stubs';
// @endif

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
  hasClickedComment: boolean,
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
  hasClickedComment: false,
  downloadProgress: undefined,
  upgradeDownloading: undefined,
  upgradeDownloadComplete: undefined,
  checkUpgradeTimer: undefined,
  isUpgradeAvailable: undefined,
  isUpgradeSkipped: undefined,
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

reducers[ACTIONS.AUTO_UPDATE_DECLINED] = state =>
  Object.assign({}, state, {
    autoUpdateDeclined: true,
  });

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
  });
};

reducers[ACTIONS.MEDIA_PLAY] = state =>
  Object.assign({}, state, {
    modalsAllowed: false,
  });

reducers[ACTIONS.MEDIA_PAUSE] = state =>
  Object.assign({}, state, {
    modalsAllowed: true,
  });

reducers[ACTIONS.SET_PLAYING_URI] = (state, action) => {
  if (action.data.uri === null) {
    return Object.assign({}, state, {
      modalsAllowed: true,
    });
  }
  return state;
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

reducers[ACTIONS.UPGRADE_DOWNLOAD_PROGRESSED] = (state, action) =>
  Object.assign({}, state, {
    downloadProgress: action.data.percent,
  });

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

reducers[ACTIONS.CLEAR_UPGRADE_TIMER] = state =>
  Object.assign({}, state, {
    checkUpgradeTimer: undefined,
  });

reducers[ACTIONS.ADD_COMMENT] = state =>
  Object.assign({}, state, {
    hasClickedComment: true,
  });

reducers[ACTIONS.SHOW_MODAL] = (state, action) =>
  Object.assign({}, state, {
    modal: action.data.id,
    modalProps: action.data.modalProps,
  });

reducers[ACTIONS.HIDE_MODAL] = state =>
  Object.assign({}, state, {
    modal: null,
    modalProps: null,
  });

// This is fired from the lbryinc module
// Instead of adding callbacks in that module, we can just listen for this event
// There will be no other modals at this time as this is a blocking action
reducers[ACTIONS.AUTHENTICATION_FAILURE] = state =>
  Object.assign({}, state, {
    modal: MODALS.AUTHENTICATION_FAILURE,
  });

export default function reducer(state: AppState = defaultState, action: any) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
