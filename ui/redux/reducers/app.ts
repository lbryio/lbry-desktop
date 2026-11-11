import * as ACTIONS from "constants/action_types";

const reducers: Record<string, any> = {};

export type SnackBar = {
  message: string;
  linkText: string;
  linkTarget: string;
  isError: boolean;
};
export type AppState = {
  isLoaded: boolean;
  modal: string | null | undefined;
  modalProps: unknown;
  platform: string;
  upgradeSkipped: boolean;
  daemonVersionMatched: boolean | null | undefined;
  daemonReady: boolean;
  hasSignature: boolean;
  badgeNumber: number;
  volume: number;
  autoUpdateDownloading: boolean;
  autoUpdateDeclined: boolean;
  autoUpdateFailed: boolean;
  modalsAllowed: boolean;
  downloadProgress: number | null | undefined;
  upgradeDownloading: boolean | null | undefined;
  upgradeDownloadComplete: boolean | null | undefined;
  checkUpgradeTimer: number | null | undefined;
  isUpgradeAvailable: boolean | null | undefined;
  isUpgradeSkipped: boolean | null | undefined;
  hasClickedComment: boolean;
  enhancedLayout: boolean;
  splashAnimationEnabled: boolean;
  searchOptionsExpanded: boolean;
  isPasswordSaved: boolean;
  welcomeVersion: number;
  allowAnalytics: boolean;
  hasNavigated: boolean;
  interestedInYoutubeSync: boolean;
  activeChannel: string | null | undefined;
  incognito: boolean;
  diskSpace: DiskSpace | null | undefined;
};

const defaultState: AppState = {
  isLoaded: false,
  modal: null,
  modalProps: {},
  platform: process.platform,
  daemonVersionMatched: null,
  daemonReady: false,
  hasSignature: false,
  badgeNumber: 0,
  volume: 1,
  // @if TARGET='app'
  upgradeSkipped: sessionStorage.getItem("upgradeSkipped") === "true",
  // @endif
  // @ts-expect-error - TS2322 - Type '{ isLoaded: false; modal: null; modalProps: {}; platform: NodeJS.Platform; daemonVersionMatched: null; daemonReady: false; hasSignature: false; badgeNumber: number; volume: number; upgradeSkipped: boolean; ... 27 more ...; diskSpace: null; }' is not assignable to type 'AppState'.
  muted: false,
  autoUpdateDownloading: false,
  autoUpdateDownloaded: false,
  autoUpdateDeclined: false,
  autoUpdateFailed: false,
  modalsAllowed: true,
  hasClickedComment: false,
  downloadProgress: undefined,
  upgradeInitialized: false,
  upgradeFailedInstallation: false,
  upgradeDownloading: undefined,
  upgradeDownloadComplete: undefined,
  checkUpgradeTimer: undefined,
  isUpgradeAvailable: undefined,
  isUpgradeSkipped: undefined,
  enhancedLayout: false,
  splashAnimationEnabled: true,
  searchOptionsExpanded: false,
  currentScroll: 0,
  scrollHistory: [0],
  isPasswordSaved: false,
  welcomeVersion: 0.0,
  allowAnalytics: false,
  hasNavigated: false,
  interestedInYoutubeSync: false,
  activeChannel: undefined,
  incognito: false,
  diskSpace: null,
};

// @@router comes from react-router
// This action is dispatched any time a user navigates forward or back
try {
  defaultState.volume = Number(sessionStorage.getItem("volume") || 1);
} catch (e: any) {}

reducers["@@router/LOCATION_CHANGE"] = (state: unknown, action: unknown) => {
  // @ts-expect-error - TS2339 - Property 'currentScroll' does not exist on type '{}'.
  const { currentScroll } = state;
  // @ts-expect-error - TS2339 - Property 'scrollHistory' does not exist on type 'unknown'. | TS2339 - Property 'scrollHistory' does not exist on type 'unknown'.
  const scrollHistory = (state.scrollHistory && state.scrollHistory.slice()) || [];
  // @ts-expect-error - TS2339 - Property 'payload' does not exist on type 'unknown'.
  const { action: name } = action.payload;
  let newCurrentScroll = currentScroll;
  if (name === "PUSH") {
    scrollHistory.push(window.scrollY);
    newCurrentScroll = 0;
  } else if (name === "POP") {
    newCurrentScroll = scrollHistory[scrollHistory.length - 1];
    scrollHistory.pop();
  }

  return {
    // @ts-expect-error - TS2698 - Spread types may only be created from object types.
    ...state,
    scrollHistory,
    currentScroll: newCurrentScroll,
  };
};

reducers[ACTIONS.DAEMON_READY] = (state: unknown) =>
  Object.assign({}, state, {
    daemonReady: true,
  });

reducers[ACTIONS.PASSWORD_SAVED] = (state: unknown, action: unknown) =>
  Object.assign({}, state, {
    // @ts-expect-error - TS2339 - Property 'data' does not exist on type 'unknown'.
    isPasswordSaved: action.data,
  });

reducers[ACTIONS.DAEMON_VERSION_MATCH] = (state: unknown) =>
  Object.assign({}, state, {
    daemonVersionMatched: true,
  });

reducers[ACTIONS.DAEMON_VERSION_MISMATCH] = (state: unknown) =>
  Object.assign({}, state, {
    daemonVersionMatched: false,
  });

reducers[ACTIONS.UPGRADE_CANCELLED] = (state: unknown) =>
  Object.assign({}, state, {
    downloadProgress: null,
    upgradeDownloadComplete: false,
    modal: null,
  });

reducers[ACTIONS.AUTO_UPDATE_DOWNLOADING] = (state: unknown) =>
  Object.assign({}, state, {
    autoUpdateDownloading: true,
    autoUpdateDownloaded: false,
    autoUpdateFailed: false,
  });

reducers[ACTIONS.AUTO_UPDATE_DOWNLOADED] = (state: unknown) =>
  Object.assign({}, state, {
    autoUpdateDownloading: false,
    autoUpdateDownloaded: true,
    autoUpdateFailed: false,
  });

reducers[ACTIONS.AUTO_UPDATE_DECLINED] = (state: unknown) =>
  Object.assign({}, state, {
    autoUpdateDeclined: true,
  });

reducers[ACTIONS.AUTO_UPDATE_RESET] = (state: unknown) =>
  Object.assign({}, state, {
    autoUpdateFailed: false,
    autoUpdateDownloading: false,
    autoUpdateDownloaded: false,
  });

reducers[ACTIONS.AUTO_UPDATE_FAILED] = (state: unknown) =>
  Object.assign({}, state, {
    autoUpdateDownloading: false,
    autoUpdateDownloaded: false,
    autoUpdateFailed: true,
  });

reducers[ACTIONS.UPGRADE_DOWNLOAD_COMPLETED] = (state: unknown, action: unknown) =>
  Object.assign({}, state, {
    // @ts-expect-error - TS2339 - Property 'data' does not exist on type 'unknown'.
    downloadPath: action.data.path,
    upgradeDownloading: false,
    upgradeDownloadCompleted: true,
  });

reducers[ACTIONS.UPGRADE_DOWNLOAD_STARTED] = (state: unknown) =>
  Object.assign({}, state, {
    upgradeDownloading: true,
  });

reducers[ACTIONS.UPGRADE_INIT_INSTALL] = (state: unknown) =>
  Object.assign({}, state, {
    upgradeInitialized: true,
    upgradeFailedInstallation: false,
  });

reducers[ACTIONS.UPGRADE_INSTALL_ERROR] = (state: unknown) =>
  Object.assign({}, state, {
    upgradeInitialized: false,
    upgradeFailedInstallation: true,
  });

reducers[ACTIONS.CHANGE_MODALS_ALLOWED] = (state: unknown, action: unknown) =>
  Object.assign({}, state, {
    // @ts-expect-error - TS2339 - Property 'data' does not exist on type 'unknown'.
    modalsAllowed: action.data.modalsAllowed,
  });

reducers[ACTIONS.SKIP_UPGRADE] = (state: unknown) => {
  sessionStorage.setItem("upgradeSkipped", "true");

  return Object.assign({}, state, {
    isUpgradeSkipped: true,
  });
};

reducers[ACTIONS.MEDIA_PLAY] = (state: unknown) =>
  Object.assign({}, state, {
    modalsAllowed: false,
  });

reducers[ACTIONS.MEDIA_PAUSE] = (state: unknown) =>
  Object.assign({}, state, {
    modalsAllowed: true,
  });

reducers[ACTIONS.SET_PLAYING_URI] = (state: unknown, action: unknown) => {
  // @ts-expect-error - TS2339 - Property 'data' does not exist on type 'unknown'.
  if (action.data.uri === null) {
    return Object.assign({}, state, {
      modalsAllowed: true,
    });
  }
  return state;
};

reducers[ACTIONS.UPDATE_VERSION] = (state: unknown, action: unknown) =>
  Object.assign({}, state, {
    // @ts-expect-error - TS2339 - Property 'data' does not exist on type 'unknown'.
    version: action.data.version,
  });

reducers[ACTIONS.CHECK_UPGRADE_SUCCESS] = (state: unknown, action: unknown) =>
  Object.assign({}, state, {
    // @ts-expect-error - TS2339 - Property 'data' does not exist on type 'unknown'.
    isUpgradeAvailable: action.data.upgradeAvailable,
    // @ts-expect-error - TS2339 - Property 'data' does not exist on type 'unknown'.
    remoteVersion: action.data.remoteVersion,
  });

reducers[ACTIONS.CHECK_UPGRADE_SUBSCRIBE] = (state: unknown, action: unknown) =>
  Object.assign({}, state, {
    // @ts-expect-error - TS2339 - Property 'data' does not exist on type 'unknown'.
    checkUpgradeTimer: action.data.checkUpgradeTimer,
  });

reducers[ACTIONS.UPGRADE_DOWNLOAD_PROGRESSED] = (state: unknown, action: unknown) =>
  Object.assign({}, state, {
    // @ts-expect-error - TS2339 - Property 'data' does not exist on type 'unknown'.
    downloadProgress: action.data.percent,
  });

reducers[ACTIONS.DOWNLOADING_COMPLETED] = (state: unknown) => {
  // @ts-expect-error - TS2339 - Property 'badgeNumber' does not exist on type '{}'.
  const { badgeNumber } = state;

  // Don't update the badge number if the window is focused
  // @if TARGET='app'
  if (document.hasFocus()) return Object.assign({}, state);
  // @endif

  return Object.assign({}, state, {
    badgeNumber: badgeNumber + 1,
  });
};

reducers[ACTIONS.WINDOW_FOCUSED] = (state: unknown) =>
  Object.assign({}, state, {
    badgeNumber: 0,
  });

reducers[ACTIONS.VOLUME_CHANGED] = (state: unknown, action: unknown) =>
  Object.assign({}, state, {
    // @ts-expect-error - TS2339 - Property 'data' does not exist on type 'unknown'.
    volume: action.data.volume,
  });

reducers[ACTIONS.VOLUME_MUTED] = (state: unknown, action: unknown) =>
  Object.assign({}, state, {
    // @ts-expect-error - TS2339 - Property 'data' does not exist on type 'unknown'.
    muted: action.data.muted,
  });

reducers[ACTIONS.HISTORY_NAVIGATE] = (state: unknown) =>
  Object.assign({}, state, {
    modal: undefined,
    modalProps: {},
  });

reducers[ACTIONS.CLEAR_UPGRADE_TIMER] = (state: unknown) =>
  Object.assign({}, state, {
    checkUpgradeTimer: undefined,
  });

reducers[ACTIONS.ADD_COMMENT] = (state: unknown) =>
  Object.assign({}, state, {
    hasClickedComment: true,
  });

reducers[ACTIONS.SHOW_MODAL] = (state: unknown, action: unknown) =>
  Object.assign({}, state, {
    // @ts-expect-error - TS2339 - Property 'data' does not exist on type 'unknown'.
    modal: action.data.id,
    // @ts-expect-error - TS2339 - Property 'data' does not exist on type 'unknown'.
    modalProps: action.data.modalProps,
  });

reducers[ACTIONS.SET_WELCOME_VERSION] = (state: unknown, action: unknown) =>
  Object.assign({}, state, {
    // @ts-expect-error - TS2339 - Property 'data' does not exist on type 'unknown'.
    welcomeVersion: action.data,
  });

reducers[ACTIONS.SET_ALLOW_ANALYTICS] = (state: unknown, action: unknown) =>
  Object.assign({}, state, {
    // @ts-expect-error - TS2339 - Property 'data' does not exist on type 'unknown'.
    allowAnalytics: action.data,
  });

reducers[ACTIONS.SET_HAS_NAVIGATED] = (state: unknown, action: unknown) =>
  Object.assign({}, state, {
    // @ts-expect-error - TS2339 - Property 'data' does not exist on type 'unknown'.
    hasNavigated: action.data,
  });

reducers[ACTIONS.HIDE_MODAL] = (state: unknown) =>
  Object.assign({}, state, {
    modal: null,
    modalProps: null,
  });

reducers[ACTIONS.TOGGLE_SEARCH_EXPANDED] = (state: unknown) =>
  Object.assign({}, state, {
    // @ts-expect-error - TS2339 - Property 'searchOptionsExpanded' does not exist on type 'unknown'.
    searchOptionsExpanded: !state.searchOptionsExpanded,
  });

reducers[ACTIONS.TOGGLE_YOUTUBE_SYNC_INTEREST] = (state: unknown, action: unknown) => {
  return {
    // @ts-expect-error - TS2698 - Spread types may only be created from object types.
    ...state,
    // @ts-expect-error - TS2339 - Property 'interestedInYoutubeSync' does not exist on type 'unknown'.
    interestedInYoutubeSync: !state.interestedInYoutubeSync,
  };
};

reducers[ACTIONS.TOGGLE_SPLASH_ANIMATION] = (state: unknown, action: unknown) => {
  return {
    // @ts-expect-error - TS2698 - Spread types may only be created from object types.
    ...state,
    // @ts-expect-error - TS2339 - Property 'splashAnimationEnabled' does not exist on type 'unknown'.
    splashAnimationEnabled: !state.splashAnimationEnabled,
  };
};

reducers[ACTIONS.SET_ACTIVE_CHANNEL] = (state: unknown, action: unknown) => {
  return {
    // @ts-expect-error - TS2698 - Spread types may only be created from object types.
    ...state,
    // @ts-expect-error - TS2339 - Property 'data' does not exist on type 'unknown'.
    activeChannel: action.data.claimId,
  };
};

reducers[ACTIONS.SET_INCOGNITO] = (state: unknown, action: unknown) => {
  return {
    // @ts-expect-error - TS2698 - Spread types may only be created from object types.
    ...state,
    // @ts-expect-error - TS2339 - Property 'data' does not exist on type 'unknown'.
    incognito: action.data.enabled,
  };
};

reducers[ACTIONS.DISK_SPACE] = (state: unknown, action: unknown) => {
  return {
    // @ts-expect-error - TS2698 - Spread types may only be created from object types.
    ...state,
    // @ts-expect-error - TS2339 - Property 'data' does not exist on type 'unknown'.
    diskSpace: action.data,
  };
};

reducers[ACTIONS.SYNC_STATE_POPULATE] = (state: unknown, action: unknown) => {
  // @ts-expect-error - TS2339 - Property 'data' does not exist on type 'unknown'.
  const { allowAnalytics } = action.data;
  return {
    // @ts-expect-error - TS2698 - Spread types may only be created from object types.
    ...state,
    ...(allowAnalytics !== undefined ? { allowAnalytics } : {}),
  };
};

reducers[ACTIONS.PURCHASE_URI_FAILED] = (state: unknown, action: unknown) => {
  return {
    // @ts-expect-error - TS2698 - Spread types may only be created from object types.
    ...state,
    modal: null,
    modalProps: null,
  };
};

export default function reducer(state: AppState | null | undefined = defaultState, action: any) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
