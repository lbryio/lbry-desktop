// @flow

// ****************************************************************************
// ****************************************************************************

export const LS = Object.freeze({
  AUTH_IN_PROGRESS: 'authInProgress',
  CHANNEL_LIVE_STATUS: 'channel-live-status',
  GDPR_REQUIRED: 'gdprRequired', // <-- should be using 'locale/get', right?
  SHARE_INTERNAL: 'shareInternal',
  TUS_LOCKED_UPLOADS: 'tusLockedUploads',
  TUS_REFRESH_LOCK: 'tusRefreshLock',
  TUS_REMOVED_UPLOADS: 'tusRemovedUploads',
});

// ****************************************************************************
// ****************************************************************************

export function isLocalStorageAvailable() {
  try {
    return Boolean(window.localStorage);
  } catch (e) {
    return false;
  }
}

export function isSessionStorageAvailable() {
  try {
    return Boolean(window.sessionStorage);
  } catch (e) {
    return false;
  }
}

export function getLocalStorageSummary() {
  try {
    const count = window.localStorage.length;
    const estimatedSize = JSON.stringify(window.localStorage).length;
    return `${count} items; ${estimatedSize} bytes`;
  } catch (e) {
    return 'inaccessible';
  }
}

// ****************************************************************************
// LocalStorage (wrapper for 'window.localStorage')
// ****************************************************************************

// This assumes that local storage availability never changes after boot.
const localStorageAvailable = isLocalStorageAvailable();

export const LocalStorage = {
  setItem: (key: string, value: string) => {
    if (localStorageAvailable) window.localStorage.setItem(key, value);
  },

  getItem: (key: string) => {
    return localStorageAvailable ? window.localStorage.getItem(key) : undefined;
  },

  removeItem: (key: string) => {
    if (localStorageAvailable) window.localStorage.removeItem(key);
  },
};
