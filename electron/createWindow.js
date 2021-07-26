import { WEBPACK_ELECTRON_PORT } from 'config';
import { app, BrowserWindow, dialog, shell, screen, nativeImage } from 'electron';
import isDev from 'electron-is-dev';
import windowStateKeeper from 'electron-window-state';
import SUPPORTED_LANGUAGES from 'constants/supported_languages';
import { SUPPORTED_SUB_LANGUAGE_CODES, SUB_LANG_CODE_LEN } from 'constants/supported_sub_languages';
import SUPPORTED_BROWSER_LANGUAGES from 'constants/supported_browser_languages';
import { TO_TRAY_WHEN_CLOSED } from 'constants/settings';

import setupBarMenu from './menu/setupBarMenu';
import * as PAGES from 'constants/pages';

function GetAppLangCode() {
  // https://www.electronjs.org/docs/api/locales
  // 1. Gets the user locale.
  // 2. Converts unsupported sub-languages to its primary (e.g. "en-GB" -> "en").
  //    Note that the primary itself may or may not be a supported language
  //    (up to clients to verify against SUPPORTED_LANGUAGES).
  const langCode = app.getLocale();
  if (langCode.length === SUB_LANG_CODE_LEN && !SUPPORTED_SUB_LANGUAGE_CODES.includes(langCode)) {
    return SUPPORTED_BROWSER_LANGUAGES[langCode.slice(0, 2)];
  }
  return SUPPORTED_BROWSER_LANGUAGES[langCode];
}

export default appState => {
  // Get primary display dimensions from Electron.
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Load the previous state with fallback to defaults.
  const windowState = windowStateKeeper({
    defaultWidth: width,
    defaultHeight: height,
  });

  const startMinimized = (process.argv || []).includes('--hidden');

  const windowConfiguration = {
    backgroundColor: '#270f34', // Located in src/scss/init/_vars.scss `--color-background--splash`
    minWidth: 950,
    minHeight: 600,
    autoHideMenuBar: true,
    titleBarStyle: 'hiddenInset',
    show: false,
    // Create the window using the state information.
    x: windowState.x,
    y: windowState.y,
    // If state is undefined, create window as maximized.
    width: windowState.width === undefined ? width : windowState.width,
    height: windowState.height === undefined ? height : windowState.height,
    icon: nativeImage.createFromPath('static/img/tray/default/tray.png'),
    webPreferences: {
      // Disable renderer process's webSecurity on development to enable CORS.
      webSecurity: !isDev,
      plugins: true,
      nodeIntegration: true,
    },
  };
  const lbryProto = 'lbry://';
  const lbryProtoQ = 'lbry://?';
  const rendererURL = isDev ? `http://localhost:${WEBPACK_ELECTRON_PORT}` : `file://${__dirname}/index.html`;

  let window = new BrowserWindow(windowConfiguration);

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state.
  windowState.manage(window);

  let deepLinkingURI;

  if ((process.platform === 'win32' || process.platform === 'linux') && String(process.argv[1]).startsWith('lbry')) {
    [, deepLinkingURI] = process.argv || '';
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
    deepLinkingURI = appState.macDeepLinkingURI || '';
  }

  // is it a lbry://? pointing to an app page
  if (deepLinkingURI.includes(lbryProtoQ)) {
    let path = deepLinkingURI.substr(lbryProtoQ.length);
    let page = path.indexOf('?') >= 0 ? path.substring(0, path.indexOf('?')) : path;
    if (Object.values(PAGES).includes(page)) {
      deepLinkingURI = deepLinkingURI.replace(lbryProtoQ, '#/$/');
    } else {
      deepLinkingURI = '';
    }
    // else is it a claim
  } else if (deepLinkingURI.includes(lbryProto)) {
    deepLinkingURI = deepLinkingURI.replace(lbryProto, '#');
  } else {
    deepLinkingURI = '';
  }

  setupBarMenu();

  window.loadURL(rendererURL + deepLinkingURI);

  window.on('close', event => {
    if (appState.isQuitting) {
      return;
    }

    if (!appState.autoUpdateAccepted) {
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

    const getToTrayWhenClosedSetting = window.webContents.executeJavaScript(`localStorage.getItem('${TO_TRAY_WHEN_CLOSED}')`);

    getToTrayWhenClosedSetting.then(toTrayWhenClosedSetting => {
      const closeApp = toTrayWhenClosedSetting === 'false';

      if (closeApp) {
        app.quit();
      }
    });
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
    startMinimized ? window.hide() : window.show();
  });

  // A backup incase https://github.com/electron/electron/issues/7779 happens
  window.webContents.once('dom-ready', () => {
    startMinimized && window.hide();
  });

  window.webContents.on('did-finish-load', () => {
    window.webContents.session.setUserAgent(`LBRY/${app.getVersion()}`);

    // restore the user's previous language - we have to do this from here because only electron process can access app.getLocale()
    window.webContents.executeJavaScript("localStorage.getItem('language')").then(storedLanguage => {
      const language =
        storedLanguage && storedLanguage !== 'undefined' && storedLanguage !== 'null'
          ? storedLanguage
          : GetAppLangCode();
      if (language !== 'en' && SUPPORTED_LANGUAGES[language]) {
        window.webContents.send('language-set', language);
      }
    });
  });

  window.webContents.on('crashed', () => {
    window = null;
  });

  window.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  window.webContents.on('update-target-url', (event, url) => {
    // Change internal links to the lbry protocol. External (https) links should remain unchanged.
    let hoverUrlBase = `http://localhost:${WEBPACK_ELECTRON_PORT}/`;
    if (!isDev) {
      // Return format of 'update-target-url':
      //   Linux:   file:///@claim
      //   Windows: file:///C:/@claim
      // Use '__dirname' in case installation is not in C:
      const path = require('path');
      const exeRoot = path.parse(__dirname).root;

      if (process.platform === 'win32') {
        // Add extra "/" prefix. Convert "C:\" to "C:/"
        hoverUrlBase = `file:///` + exeRoot.replace(/\\/g, '/');
      } else {
        hoverUrlBase = `file://` + exeRoot;
      }
    }

    let dispUrl = url.replace(hoverUrlBase, lbryProto);
    // Non-claims don't need the lbry protocol:
    if (dispUrl === lbryProto) {
      dispUrl = 'Home';
    } else if (dispUrl.startsWith(lbryProto + '$/')) {
      dispUrl = dispUrl.replace(lbryProto, '/');
    }
    window.webContents.send('update-target-url', dispUrl);
  });

  return window;
};
