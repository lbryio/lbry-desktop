// @flow

import * as ACTIONS from 'constants/action_types';
import * as MODALS from 'constants/modal_types';
import { remote } from 'electron';

// @if TARGET='app'
const win = remote.BrowserWindow.getFocusedWindow();
// @endif

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
  enhancedLayout: boolean,
  searchOptionsExpanded: boolean,
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
  muted: false,
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
  enhancedLayout: false,
  searchOptionsExpanded: false,
  currentScroll: 0,
  scrollHistory: [0],
};

// @@router comes from react-router
// This action is dispatched any time a user navigates forward or back
reducers['@@router/LOCATION_CHANGE'] = (state, action) => {
  const { currentScroll } = state;
  const scrollHistory = (state.scrollHistory && state.scrollHistory.slice()) || [];
  const { action: name } = action.payload;

  let newCurrentScroll = currentScroll;
  if (name === 'PUSH') {
    scrollHistory.push(window.scrollY);
    newCurrentScroll = 0;
  } else if (name === 'POP') {
    newCurrentScroll = scrollHistory[scrollHistory.length - 1];
    scrollHistory.pop();
  }

  return {
    ...state,
    scrollHistory,
    currentScroll: newCurrentScroll,
  };
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
  // @if TARGET='app'
  if (win && win.isFocused()) return Object.assign({}, state);
  // @endif

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

reducers[ACTIONS.VOLUME_MUTED] = (state, action) =>
  Object.assign({}, state, {
    muted: action.data.muted,
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

reducers[ACTIONS.TOGGLE_SEARCH_EXPANDED] = state =>
  Object.assign({}, state, {
    searchOptionsExpanded: !state.searchOptionsExpanded,
  });

export default function reducer(state: AppState = defaultState, action: any) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
