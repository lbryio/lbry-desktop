// @flow
import { ipcRenderer } from 'electron';
import { DOMAIN } from 'config';

const isProduction = process.env.NODE_ENV === 'production';
const maxExpiration = 2147483647;
let sessionPassword;

function setCookie(name: string, value: string, days: number) {
  let expires = '';
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    // If on PC, set to not expire (max)
    expires = `expires=${IS_WEB ? date.toUTCString() : maxExpiration};`;
  }

  let cookie = `${name}=${value || ''}; ${expires} path=/; SameSite=Lax;`;
  if (isProduction) {
    cookie += ` domain=.${DOMAIN}; Secure;`;
  }

  document.cookie = cookie;
}

function getCookie(name: string) {
  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');

  for (var i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }

    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
}

function deleteCookie(name: string) {
  document.cookie = name + `=; Max-Age=-99999999; domain=.${DOMAIN}; path=/;`;

  // Legacy
  // Adding this here to delete any old cookies before we switched to . + DOMAIN
  // Remove this if you see it after July 1st, 2020
  document.cookie = name + `=; Max-Age=-99999999; domain=${DOMAIN}; path=/;`;
}

export const setSavedPassword = (value?: string, saveToDisk: boolean) => {
  return new Promise<*>(resolve => {
    const password = value === undefined || value === null ? '' : value;
    sessionPassword = password;

    if (saveToDisk) {
      if (password) {
        setCookie('saved-password', password, 14);
      } else {
        deleteSavedPassword();
      }
    }
  });
};

export const getSavedPassword = () => {
  return new Promise<*>(resolve => {
    if (sessionPassword) {
      resolve(sessionPassword);
    }

    return getKeychainPassword().then(p => resolve(p));
  });
};

export const getKeychainPassword = () => {
  return new Promise<*>(resolve => {
    const password = getCookie('saved-password');
    if (password) {
      resolve(password);
    }
    // We can remove this when we remove keytar
    else {
      ipcRenderer.once('get-password-response', (event, password) => {
        resolve(password);
      });
      ipcRenderer.send('get-password');
    }

    // @if TARGET='app'

    // @endif
  });
};

export const deleteSavedPassword = () => {
  return new Promise<*>(resolve => {
    deleteCookie('saved-password');
    resolve();
  });
};

export const getAuthToken = () => {
  return getCookie('auth_token');
};

export const setAuthToken = (value: string) => {
  return setCookie('auth_token', value, 365);
};

export const deleteAuthToken = () => {
  return new Promise<*>(resolve => {
    deleteCookie('auth_token');
    resolve();
  });
};

export const doSignOutCleanup = () => {
  return new Promise<*>(resolve => {
    deleteCookie('auth_token');
    deleteCookie('saved-password');
    resolve();
  });
};

export const testKeychain = () => {
  // we should make sure it works on startup
};
