import { app, BrowserWindow, dialog, shell, screen } from 'electron';
import isDev from 'electron-is-dev';
import windowStateKeeper from 'electron-window-state';

import setupBarMenu from './menu/setupBarMenu';

export default appState => {
  // Get primary display dimensions from Electron.
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Load the previous state with fallback to defaults.
  const windowState = windowStateKeeper({
    defaultWidth: width,
    defaultHeight: height,
  });

  const windowConfiguration = {
    backgroundColor: '#44b098',
    minWidth: 950,
    minHeight: 600,
    autoHideMenuBar: true,
    show: false,
    // Create the window using the state information.
    x: windowState.x,
    y: windowState.y,
    // If state is undefined, create window as maximized.
    width: windowState.width === undefined ? width : windowState.width,
    height: windowState.height === undefined ? height : windowState.height,

    webPreferences: {
      // Disable renderer process's webSecurity on development to enable CORS.
      webSecurity: !isDev,
      plugins: true,
    },
  };

  const rendererURL = isDev
    ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
    : `file://${__dirname}/index.html`;

  let window = new BrowserWindow(windowConfiguration);

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state.
  windowState.manage(window);

  window.loadURL(rendererURL);

  let deepLinkingURI;
  if (
    (process.platform === 'win32' || process.platform === 'linux') &&
    String(process.argv[1]).startsWith('lbry')
  ) {
    [, deepLinkingURI] = process.argv;
    // Keep only command line / deep linked arguments
    // Windows normalizes URIs when they're passed in from other apps. On Windows, this tries to
    // restore the original URI that was typed.
    //   - If the URI has no path, Windows adds a trailing slash. LBRY URIs can't have a slash with no
    //     path, so we just strip it off.
    //   - In a URI with a claim ID, like lbry://channel#claimid, Windows interprets the hash mark as
    //     an anchor and converts it to lbry://channel/#claimid. We remove the slash here as well.
    //   - ? also interpreted as an anchor, remove slash also.
    if (process.platform === 'win32') {
      deepLinkingURI = deepLinkingURI
        .replace(/\/$/, '')
        .replace('/#', '#')
        .replace('/?', '?');
    }
  } else {
    deepLinkingURI = appState.macDeepLinkingURI;
  }

  setupBarMenu();

  window.on('close', event => {
    if (!appState.isQuitting && !appState.autoUpdateAccepted) {
      event.preventDefault();
      if (window.isFullScreen()) {
        window.once('leave-full-screen', () => {
          window.hide();
        });
        window.setFullScreen(false);
      } else {
        window.hide();
      }
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
  
  window.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  return window;
};
