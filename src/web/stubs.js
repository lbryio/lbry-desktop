const callable = () => {};
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

export const y18n = () => ({
  getLocale: returningCallable('en'),
  __: value => value,
  __n: value => value,
});

export const isDev = false;
