const callable = () => {
  throw new Error('Need to fix this stub');
};

export const remote = {
  dialog: {
    showOpenDialog: callable,
  },
  getCurrentWindow: callable,
  app: {
    getAppPath: callable,
    getLocale: () => 'en',
  },
  BrowserWindow: {
    getFocusedWindow: callable,
  },
  Menu: {
    getApplicationMenu: callable,
    buildFromTemplate: () => {
      return {
        popup: () => {},
      };
    },
  },
  require: callable,
};

export const clipboard = {
  readText: () => '',
  writeText: text => {
    var dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  },
};
export const ipcRenderer = {};

export const isDev = false;
