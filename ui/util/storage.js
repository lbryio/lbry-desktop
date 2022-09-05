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

const TEST_KEY = '__E1648C16E620203B60C99B285B255C47899B9A76A52387B77B61456D6601CC7B__';

export function isLocalStorageAvailable() {
  try {
    window.localStorage.setItem(TEST_KEY, TEST_KEY);
    window.localStorage.removeItem(TEST_KEY);
    return true;
  } catch (e) {
    return false;
  }
}

export function isSessionStorageAvailable() {
  try {
    window.sessionStorage.setItem(TEST_KEY, TEST_KEY);
    window.sessionStorage.removeItem(TEST_KEY);
    return true;
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
// Wrapper for localStorage/sessionStorage
// ****************************************************************************

// Wrapper for local/sessionStorage that helps to suppress errors.
// !! Use this only in areas where the error does not matter,
// !! or the null return value is handled with a fallback.

export const LocalStorage = storageFactory(() => window.localStorage, 'localStorage');
export const SessionStorage = storageFactory(() => window.sessionStorage, 'sessionStorage');

// ****************************************************************************
// Internal
// ****************************************************************************

function storageFactory(getStorage: () => Storage, name: string) {
  // Adapted from https://github.com/MichalZalecki/storage-factory.
  // Changes:
  // - No in-memory fallback, at least for now. Not sure what will happen when
  //   quota is exceeded during use ... will it be mixing storages?
  // - Skip the 'write-read-erase' test sequence, which makes dev tool's storage
  //   viewer blink. The failure to call the function itself should be sufficient.

  function clear(): void {
    try {
      getStorage().clear();
    } catch (e) {
      log(e, 'clear');
    }
  }

  function getItem(name: string): ?string {
    try {
      return getStorage().getItem(name);
    } catch (e) {
      log(e, 'getItem');
    }
    return null;
  }

  function key(index: number): ?string {
    try {
      return getStorage().key(index);
    } catch (e) {
      log(e, 'key');
    }
  }

  function removeItem(name: string): void {
    try {
      getStorage().removeItem(name);
    } catch (e) {
      log(e, 'removeItem');
    }
  }

  function setItem(name: string, value: string): void {
    try {
      getStorage().setItem(name, value);
    } catch (e) {
      log(e, 'setItem');
    }
  }

  function length(): ?number {
    try {
      return getStorage().length;
    } catch (e) {
      log(e, 'length');
    }
  }

  function log(e: Error, func: string) {
    // analytics.log(e, { fingerprint: [`${name}-${func}`] }, `${name}`);
  }

  return {
    getItem,
    setItem,
    removeItem,
    clear,
    key,
    get length() {
      return length();
    },
  };
}
