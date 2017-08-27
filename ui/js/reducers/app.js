import * as types from "constants/action_types";
import * as modalTypes from "constants/modal_types";

const currentPath = () => {
  const hash = document.location.hash;
  if (hash !== "") return hash.replace(/^#/, "");
  else return "/discover";
};

const { remote } = require("electron");
const application = remote.app;
const win = remote.BrowserWindow.getFocusedWindow();

const reducers = {};
const defaultState = {
  isLoaded: false,
  isBackDisabled: true,
  isForwardDisabled: true,
  currentPath: currentPath(),
  pathAfterAuth: "/discover",
  platform: process.platform,
  upgradeSkipped: sessionStorage.getItem("upgradeSkipped"),
  daemonVersionMatched: null,
  daemonReady: false,
  hasSignature: false,
  badgeNumber: 0,
  history: { index: 0, stack: [] },
  volume: sessionStorage.getItem("volume") || 1,
};

reducers[types.DAEMON_READY] = function(state, action) {
  const { history } = state;
  const { page } = action.data;
  history.stack.push(page);

  return Object.assign({}, state, {
    daemonReady: true,
    history,
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

reducers[types.CHANGE_PATH] = function(state, action) {
  return Object.assign({}, state, {
    currentPath: action.data.path,
  });
};

reducers[types.CHANGE_AFTER_AUTH_PATH] = function(state, action) {
  return Object.assign({}, state, {
    pathAfterAuth: action.data.path,
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
    modalExtraContent: action.data.extraContent,
  });
};

reducers[types.CLOSE_MODAL] = function(state, action) {
  return Object.assign({}, state, {
    modal: undefined,
    modalExtraContent: undefined,
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

reducers[types.HISTORY_NAVIGATE] = (state, action) => {
  // Get history from state
  const { history } = state;

  let { location, page } = action.data;

  // Add new location to stack
  if (location) {
    const lastIndex = history.stack.length - 1;
    const lastPage = history.stack[lastIndex].location;

    // Check for duplicated
    let is_duplicate = lastIndex > -1
      ? lastPage.replace(/[?]$/, "") === location.replace(/[?]$/, "")
      : false;

    if (!is_duplicate) {
      // Create new page
      page = {
        index: history.stack.length,
        location,
      };

      // Update index
      history.index = history.stack.length;

      // Add to stack
      history.stack.push(page);
    }
  } else if (page) {
    // Update index
    history.index = page.index;
  }

  return Object.assign({}, state, {
    history,
    isBackDisabled: history.index === 0, // First page
    isForwardDisabled: history.index === history.stack.length - 1, // Last page
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
