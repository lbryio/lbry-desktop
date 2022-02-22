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
