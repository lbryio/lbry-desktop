const callable = () => {
  throw Error('Need to fix this stub');
};
const returningCallable = value => () => value;

export const remote = {
  dialog: {
    showOpenDialog: callable,
  },
  getCurrentWindow: callable,
  app: {
    getAppPath: callable,
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
