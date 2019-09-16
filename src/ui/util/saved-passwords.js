import { ipcRenderer } from 'electron';

export const setSavedPassword = value => {
  return new Promise(
    resolve => {
      ipcRenderer.once('set-password-response', (event, success) => {
        resolve(success);
      });
      ipcRenderer.send('set-password', value);
    },
    reject => {
      reject(false);
    }
  );
};

export const getSavedPassword = () => {
  return new Promise(
    resolve => {
      ipcRenderer.once('get-password-response', (event, password) => {
        resolve(password);
      });
      ipcRenderer.send('get-password');
    },
    reject => reject(false)
  );
};

export const deleteAuthToken = () => {
  return new Promise(
    resolve => {
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
    },
    reject => {
      reject(false);
    }
  );
};

export const testKeychain = () => {
  // we should make sure it works on startup
};
