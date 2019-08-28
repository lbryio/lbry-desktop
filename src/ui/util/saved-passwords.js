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

export const deleteSavedPassword = () => {
  return new Promise(
    resolve => {
      ipcRenderer.once('delete-password-response', (event, success) => {
        resolve(success);
      });
      ipcRenderer.send('delete-password');
    },
    reject => {
      reject(false);
    }
  );
};

export const testKeychain = () => {
  // we should make sure it works on startup
};
