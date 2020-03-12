// @flow
import { ipcRenderer } from 'electron';

const AUTH_TOKEN = 'auth_token';
const SAVED_PASSWORD = 'saved_password';
const DEPRECATED_SAVED_PASSWORD = 'saved-password';

const domain = window.location.hostname;
const isProduction = process.env.NODE_ENV === 'production';
const maxExpiration = 2147483647;
let sessionPassword;

function setCookie(name: string, value: string, expirationDaysOnWeb: number) {
  let expires = '';
  if (expirationDaysOnWeb) {
    let date = new Date();
    date.setTime(date.getTime() + expirationDaysOnWeb * 24 * 60 * 60 * 1000);
    // If on PC, set to not expire (max)
    expires = `expires=${IS_WEB ? date.toUTCString() : maxExpiration};`;
  }

  let cookie = `${name}=${value || ''}; ${expires} path=/; SameSite=Lax;`;
  if (isProduction) {
    cookie += ` domain=${domain}; Secure;`;
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
  document.cookie = name + `=; Max-Age=-99999999; domain=${domain}; path=/;`;

  // Legacy
  // Adding this here to delete any old cookies before we removed the "." in front of the domain
  // Remove this if you see it after March 11th, 2021
  // https://github.com/lbryio/lbry-desktop/pull/3830
  document.cookie = name + `=; Max-Age=-99999999; domain=.${domain}; path=/;`;
}

export const setSavedPassword = (value?: string, saveToDisk: boolean) => {
  return new Promise<*>(resolve => {
    const password = value === undefined || value === null ? '' : value;
    sessionPassword = password;

    if (saveToDisk) {
      if (password) {
        setCookie(SAVED_PASSWORD, password, 14);
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
    let password;
    // @if TARGET='web'
    // In the future, this will be the only code in this function
    // Handling keytar stuff separately so we can easily rip it out later
    password = getCookie(SAVED_PASSWORD);
    resolve(password);
    // @endif

    // @if TARGET='app'
    password = getCookie(SAVED_PASSWORD);

    if (password) {
      resolve(password);
    } else {
      // No password saved in a cookie, get it from the keychain, then delete the value in the keychain
      ipcRenderer.once('get-password-response', (event, keychainPassword) => {
        resolve(keychainPassword);

        if (keychainPassword) {
          setSavedPassword(keychainPassword, true);
          ipcRenderer.send('delete-password');
        }
      });

      ipcRenderer.send('get-password');
    }
    // @endif
  });
};

export const deleteSavedPassword = () => {
  return new Promise<*>(resolve => {
    deleteCookie(SAVED_PASSWORD);
    resolve();
  });
};

export const getAuthToken = () => {
  return getCookie(AUTH_TOKEN);
};

export const setAuthToken = (value: string) => {
  return setCookie(AUTH_TOKEN, value, 365);
};

export const deleteAuthToken = () => {
  return new Promise<*>(resolve => {
    deleteCookie(AUTH_TOKEN);
    resolve();
  });
};

export const doSignOutCleanup = () => {
  return new Promise<*>(resolve => {
    deleteAuthToken();
    deleteSavedPassword();
    resolve();

    // @if TARGET='app'
    ipcRenderer.send('delete-auth-token');
    ipcRenderer.send('delete-password');
    // @endif;
  });
};

export const doCookieCleanup = () => {
  const authToken = getAuthToken();
  if (authToken) {
    deleteAuthToken();
    setAuthToken(authToken);
  }

  const savedPassword = getCookie(DEPRECATED_SAVED_PASSWORD);
  if (savedPassword) {
    deleteCookie(DEPRECATED_SAVED_PASSWORD);
    setSavedPassword(savedPassword, true);
  }
};
