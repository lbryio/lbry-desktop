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
