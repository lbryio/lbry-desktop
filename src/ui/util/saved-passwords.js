import { ipcRenderer } from 'electron';

let sessionPassword;

export const setSavedPassword = (value, saveToDisk) => {
  return new Promise(resolve => {
    ipcRenderer.once('set-password-response', (event, success) => {
      resolve(success);
    });

    sessionPassword = value;
    if (saveToDisk && value !== undefined) {
      ipcRenderer.send('set-password', value);
    }
  });
};

export const getSavedPassword = () => {
  return new Promise(resolve => {
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
    // Will handle saved passwords on web differently
    resolve('');
    // @endif
  });
};

export const deleteSavedPassword = () => {
  return new Promise(resolve => {
    // @if TARGET='app'
    ipcRenderer.once('delete-password-response', (event, success) => {
      resolve();
    });
    ipcRenderer.send('delete-password');
    // @endif;
  });
};

export const deleteAuthToken = () => {
  return new Promise(resolve => {
    // @if TARGET='app'
    ipcRenderer.once('delete-auth-token-response', (event, success) => {
      resolve();
    });
    ipcRenderer.send('delete-auth-token');
    // @endif;
    // @if TARGET='web'
    document.cookie = 'auth_token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
    resolve();
    // @endif
  });
};

export const testKeychain = () => {
  // we should make sure it works on startup
};
