// @flow

/**
 * This serves a bridge between tabs using localStorage to indicate whether an
 * upload is currently in progress (locked) or removed.
 *
 * An alternative is to sync the redux's 'publish::currentUploads' through the
 * wallet's sync process, but let's not pollute the wallet for now.
 */

import { v4 as uuid } from 'uuid';
import { TUS_LOCKED_UPLOADS, TUS_REMOVED_UPLOADS } from 'constants/storage';
import { isLocalStorageAvailable } from 'util/storage';
import { doUpdateUploadRemove, doUpdateUploadProgress } from 'redux/actions/publish';

const localStorageAvailable = isLocalStorageAvailable();

let gTabId: string = '';

function getTabId() {
  if (!gTabId) {
    // We want to maximize bootup speed, so only initialize
    // the tab ID on first use instead when declared.
    gTabId = uuid();
  }
  return gTabId;
}

// ****************************************************************************
// Locked
// ****************************************************************************

function getLockedUploads() {
  if (localStorageAvailable) {
    const storedValue = window.localStorage.getItem(TUS_LOCKED_UPLOADS);
    return storedValue ? JSON.parse(storedValue) : {};
  }
  return {};
}

export function tusIsSessionLocked(guid: string) {
  const lockedUploads = getLockedUploads();
  return lockedUploads[guid] && lockedUploads[guid] !== getTabId();
}

export function tusLockAndNotify(guid: string) {
  const lockedUploads = getLockedUploads();
  if (!lockedUploads[guid] && localStorageAvailable) {
    lockedUploads[guid] = getTabId();
    window.localStorage.setItem(TUS_LOCKED_UPLOADS, JSON.stringify(lockedUploads));
  }
}

/**
 * tusUnlockAndNotify
 *
 * @param guid The upload session to unlock and notify other tabs of.
 *             Passing 'undefined' will clear all sessions locked by this tab.
 */
export function tusUnlockAndNotify(guid?: string) {
  if (!localStorageAvailable) return;

  const lockedUploads = getLockedUploads();

  if (guid) {
    delete lockedUploads[guid];
  } else {
    const ourTabId = getTabId();
    const lockedUploadsEntries = Object.entries(lockedUploads);
    lockedUploadsEntries.forEach(([lockedGuid, tabId]) => {
      if (tabId === ourTabId) {
        delete lockedUploads[lockedGuid];
      }
    });
  }

  if (Object.keys(lockedUploads).length > 0) {
    window.localStorage.setItem(TUS_LOCKED_UPLOADS, JSON.stringify(lockedUploads));
  } else {
    window.localStorage.removeItem(TUS_LOCKED_UPLOADS);
  }
}

// ****************************************************************************
// Removed
// ****************************************************************************

function getRemovedUploads() {
  if (localStorageAvailable) {
    const storedValue = window.localStorage.getItem(TUS_REMOVED_UPLOADS);
    return storedValue ? storedValue.split(',') : [];
  }
  return [];
}

export function tusRemoveAndNotify(guid: string) {
  if (!localStorageAvailable) return;
  const removedUploads = getRemovedUploads();
  removedUploads.push(guid);
  window.localStorage.setItem(TUS_REMOVED_UPLOADS, removedUploads.join(','));
}

export function tusClearRemovedUploads() {
  if (!localStorageAvailable) return;
  window.localStorage.removeItem(TUS_REMOVED_UPLOADS);
}

// ****************************************************************************
// Respond to changes from other tabs.
// ****************************************************************************

export function tusHandleTabUpdates(storageKey: string) {
  switch (storageKey) {
    case TUS_LOCKED_UPLOADS:
      // The locked IDs are in localStorage, but related GUI is unaware.
      // Send a redux update to force an update.
      window.store.dispatch(doUpdateUploadProgress({ guid: 'force--update' }));
      break;

    case TUS_REMOVED_UPLOADS:
      // The other tab's store has removed this upload, so it's safe to do the
      // same without affecting rehydration.
      if (localStorageAvailable) {
        const removedUploads = getRemovedUploads();
        removedUploads.forEach((guid) => window.store.dispatch(doUpdateUploadRemove(guid)));
      }
      break;
  }
}
