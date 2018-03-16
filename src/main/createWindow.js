import { app, BrowserWindow, dialog } from 'electron';
import isDev from 'electron-is-dev';
import setupBarMenu from './menu/setupBarMenu';
import setupContextMenu from './menu/setupContextMenu';

export default appState => {
  let windowConfiguration = {
    backgroundColor: '#155B4A',
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true,
    show: false,
  };

  // Disable renderer process's webSecurity on development to enable CORS.
  windowConfiguration = isDev
    ? {
        ...windowConfiguration,
        webPreferences: {
          webSecurity: false,
        },
      }
    : windowConfiguration;

  const rendererURL = isDev
    ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
    : `file://${__dirname}/index.html`;

  let window = new BrowserWindow(windowConfiguration);

  window.maximize();

  window.loadURL(rendererURL);

  let deepLinkingURI;
  // Protocol handler for win32
  if (process.platform === 'win32' && String(process.argv[1]).startsWith('lbry')) {
    // Keep only command line / deep linked arguments
    // Windows normalizes URIs when they're passed in from other apps. On Windows, this tries to
    // restore the original URI that was typed.
    //   - If the URI has no path, Windows adds a trailing slash. LBRY URIs can't have a slash with no
    //     path, so we just strip it off.
    //   - In a URI with a claim ID, like lbry://channel#claimid, Windows interprets the hash mark as
    //     an anchor and converts it to lbry://channel/#claimid. We remove the slash here as well.
    deepLinkingURI = process.argv[1].replace(/\/$/, '').replace('/#', '#');
  }

  setupBarMenu();
  setupContextMenu(window);

  window.on('close', event => {
    if (!appState.isQuitting && !appState.autoUpdateAccepted) {
      event.preventDefault();
      window.hide();
    }
  });

  window.on('focus', () => {
    window.webContents.send('window-is-focused', null);
  });

  window.on('unresponsive', () => {
    dialog.showMessageBox(
      window,
      {
        type: 'warning',
        buttons: ['Wait', 'Quit'],
        title: 'LBRY Unresponsive',
        defaultId: 1,
        message: 'LBRY is not responding. Would you like to quit?',
        cancelId: 0,
      },
      buttonIndex => {
        if (buttonIndex === 1) app.quit();
      }
    );
  });

  window.once('ready-to-show', () => {
    window.show();
  });

  window.webContents.on('did-finish-load', () => {
    window.webContents.send('open-uri-requested', deepLinkingURI, true);
    window.webContents.session.setUserAgent(`LBRY/${app.getVersion()}`);
    if (isDev) {
      window.webContents.openDevTools();
    }
  });

  window.webContents.on('crashed', () => {
    window = null;
  });

  return window;
};
