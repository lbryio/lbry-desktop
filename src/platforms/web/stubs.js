const callable = () => {
  throw Error('Need to fix this stub');
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
  },
  require: callable,
};

export const isDev = false;
