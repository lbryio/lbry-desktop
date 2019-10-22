// @flow
import { ipcRenderer } from 'electron';

let sessionPassword;

function setCookie(name: string, value: string, days: number) {
  let expires = '';
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }

  document.cookie = `${name}=${value || ''}${expires}; path=/`;
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
  document.cookie = name + '=; Max-Age=-99999999;';
}

export const setSavedPassword = (value?: string, saveToDisk: boolean) => {
  return new Promise<*>(resolve => {
    // @if TARGET='app'
    ipcRenderer.once('set-password-response', (event, success) => {
      resolve(success);
    });
    // @endif

    const password = value === undefined || value === null ? '' : value;
    sessionPassword = password;

    if (saveToDisk) {
      if (password) {
        // @if TARGET='app'
        ipcRenderer.send('set-password', password);
        // @endif
        // @if TARGET='web'
        setCookie('saved-password', password, 14);
        // @endif
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

    // @if TARGET='app'
    ipcRenderer.once('get-password-response', (event, password) => {
      resolve(password);
    });
    ipcRenderer.send('get-password');
    // @endif

    // @if TARGET='web'
    const password = getCookie('saved-password');
    resolve(password);
    // @endif
  });
};

export const deleteSavedPassword = () => {
  return new Promise<*>(resolve => {
    // @if TARGET='app'
    ipcRenderer.once('delete-password-response', (event, success) => {
      resolve();
    });
    ipcRenderer.send('delete-password');
    // @endif;
    // @if TARGET='web'
    deleteCookie('saved-password');
    resolve();
    // @endif
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
    // @if TARGET='app'
    ipcRenderer.once('delete-auth-token-response', (event, success) => {
      resolve();
    });
    ipcRenderer.send('delete-auth-token');
    // @endif;

    deleteCookie('auth_token');
    // @if TARGET='web'
    resolve();
    // @endif
  });
};

export const testKeychain = () => {
  // we should make sure it works on startup
};
