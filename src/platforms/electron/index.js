/* eslint no-console:0 */
/* eslint space-before-function-paren:0 */
// Module imports
import '@babel/polyfill';
import keytar from 'keytar';
import SemVer from 'semver';
import https from 'https';
import { app, dialog, ipcMain, session, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import { Lbry } from 'lbry-redux';
import Daemon from './Daemon';
import isDev from 'electron-is-dev';
import createTray from './createTray';
import createWindow from './createWindow';
import pjson from '../../../package.json';
import startSandbox from './startSandbox';
import installDevtools from './installDevtools';

autoUpdater.autoDownload = true;

// This is set to true if an auto update has been downloaded through the Electron
// auto-update system and is ready to install. If the user declined an update earlier,
// it will still install on shutdown.
let autoUpdateDownloaded = false;

// This is used to keep track of whether we are showing the special dialog
// that we show on Windows after you decline an upgrade and close the app later.
let showingAutoUpdateCloseAlert = false;

// Keep a global reference, if you don't, they will be closed automatically when the JavaScript
// object is garbage collected.
let rendererWindow;

let tray; // eslint-disable-line
let daemon;

const appState = {};

app.setAsDefaultProtocolClient('lbry');
app.setName('LBRY');
app.setAppUserModelId('io.lbry.LBRY');

if (isDev) {
  // Disable security warnings in dev mode:
  // https://github.com/electron/electron/blob/master/docs/tutorial/security.md#electron-security-warnings
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
}

const startDaemon = async () => {
  let isDaemonRunning = false;

  await Lbry.status()
    .then(() => {
      isDaemonRunning = true;
      console.log('SDK already running');
    })
    .catch(() => {
      console.log('Starting SDK');
    });

  if (!isDaemonRunning) {
    daemon = new Daemon();
    daemon.on('exit', () => {
      if (!isDev) {
        daemon = null;
        if (!appState.isQuitting) {
          dialog.showErrorBox(
            'Daemon has Exited',
            'The daemon may have encountered an unexpected error, or another daemon instance is already running. \n\n' +
              'For more information please visit: \n' +
              'https://lbry.com/faq/startup-troubleshooting'
          );
        }
        app.quit();
      }
    });
    await daemon.launch();
  }
};

// When we are starting the app, ensure there are no other apps already running
const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  // Another instance already has a lock, abort
  app.quit();
} else {
  app.on('second-instance', (event, argv) => {
    // Send the url to the app to navigate first, then focus
    if (rendererWindow) {
      if ((process.platform === 'win32' || process.platform === 'linux') && String(argv[1]).startsWith('lbry')) {
        let URI = argv[1];

        // Keep only command line / deep linked arguments
        // Windows normalizes URIs when they're passed in from other apps. On Windows, this tries to
        // restore the original URI that was typed.
        //   - If the URI has no path, Windows adds a trailing slash. LBRY URIs can't have a slash with no
        //     path, so we just strip it off.
        //   - In a URI with a claim ID, like lbry://channel#claimid, Windows interprets the hash mark as
        //     an anchor and converts it to lbry://channel/#claimid. We remove the slash here as well.
        //   - ? also interpreted as an anchor, remove slash also.
        if (process.platform === 'win32') {
          URI = URI.replace(/\/$/, '')
            .replace('/#', '#')
            .replace('/?', '?');
        }

        rendererWindow.webContents.send('open-uri-requested', URI);
      }

      rendererWindow.show();
    }
  });

  app.on('ready', async () => {
    await startDaemon();
    startSandbox();

    if (isDev) {
      await installDevtools();
    }

    rendererWindow = createWindow(appState);
    tray = createTray(rendererWindow);

    if (!isDev) {
      rendererWindow.webContents.on('devtools-opened', () => {
        // Send a message to the renderer process so we can log a security warning
        rendererWindow.webContents.send('devtools-is-opened');
      });
    }

    // HACK: patch webrequest to fix devtools incompatibility with electron 2.x.
    // See https://github.com/electron/electron/issues/13008#issuecomment-400261941
    session.defaultSession.webRequest.onBeforeRequest({}, (details, callback) => {
      if (details.url.indexOf('7accc8730b0f99b5e7c0702ea89d1fa7c17bfe33') !== -1) {
        callback({
          redirectURL: details.url.replace(
            '7accc8730b0f99b5e7c0702ea89d1fa7c17bfe33',
            '57c9d07b416b5a2ea23d28247300e4af36329bdc'
          ),
        });
      } else {
        callback({ cancel: false });
      }
    });
  });
}

app.on('activate', () => {
  if (rendererWindow) {
    rendererWindow.show();
  }
});

app.on('will-quit', event => {
  if (
    process.platform === 'win32' &&
    autoUpdateDownloaded &&
    !appState.autoUpdateAccepted &&
    !showingAutoUpdateCloseAlert
  ) {
    // We're on Win and have an update downloaded, but the user declined it (or closed
    // the app without accepting it). Now the user is closing the app, so the new update
    // will install. On Mac this is silent, but on Windows they get a confusing permission
    // escalation dialog, so we show Windows users a warning dialog first.

    showingAutoUpdateCloseAlert = true;
    dialog.showMessageBox(
      {
        type: 'info',
        title: 'LBRY Will Upgrade',
        message: 'LBRY has a pending upgrade. Please select "Yes" to install it on the prompt shown after this one.',
      },
      () => {
        app.quit();
      }
    );

    event.preventDefault();
    return;
  }

  appState.isQuitting = true;
  if (daemon) {
    daemon.quit();
    event.preventDefault();
  }

  if (rendererWindow) {
    rendererWindow = null;
  }
});

app.on('will-finish-launching', () => {
  // Protocol handler for macOS
  app.on('open-url', (event, URL) => {
    event.preventDefault();

    if (rendererWindow) {
      rendererWindow.webContents.send('open-uri-requested', URL);
      rendererWindow.show();
    } else {
      appState.macDeepLinkingURI = URL;
    }
  });
});

app.on('before-quit', () => {
  appState.isQuitting = true;
});

ipcMain.on('upgrade', (event, installerPath) => {
  app.on('quit', () => {
    console.log('Launching upgrade installer at', installerPath);
    // This gets triggered called after *all* other quit-related events, so
    // we'll only get here if we're fully prepared and quitting for real.
    shell.openItem(installerPath);
  });
  // what to do if no shutdown in a long time?
  console.log('Update downloaded to', installerPath);
  console.log('The app will close, and you will be prompted to install the latest version of LBRY.');
  console.log('After the install is complete, please reopen the app.');
  app.quit();
});

autoUpdater.on('update-downloaded', () => {
  autoUpdateDownloaded = true;
});

ipcMain.on('autoUpdateAccepted', () => {
  appState.autoUpdateAccepted = true;
  autoUpdater.quitAndInstall();
});

ipcMain.on('version-info-requested', () => {
  function formatRc(ver) {
    // Adds dash if needed to make RC suffix SemVer friendly
    return ver.replace(/([^-])rc/, '$1-rc');
  }

  const localVersion = pjson.version;
  let result = '';
  const onSuccess = res => {
    res.on('data', data => {
      result += data;
    });

    res.on('end', () => {
      let json;
      try {
        json = JSON.parse(result);
      } catch (e) {
        return;
      }
      const tagName = json.tag_name;
      if (tagName) {
        const [, remoteVersion] = tagName.match(/^v([\d.]+(?:-?rc\d+)?)$/);
        if (!remoteVersion) {
          if (rendererWindow) {
            rendererWindow.webContents.send('version-info-received', localVersion);
          }
        } else {
          const upgradeAvailable = SemVer.gt(formatRc(remoteVersion), formatRc(localVersion));
          if (rendererWindow) {
            rendererWindow.webContents.send('version-info-received', {
              remoteVersion,
              localVersion,
              upgradeAvailable,
            });
          }
        }
      } else if (rendererWindow) {
        rendererWindow.webContents.send('version-info-received', localVersion);
      }
    });
  };

  const requestLatestRelease = (alreadyRedirected = false) => {
    const req = https.get(
      {
        hostname: 'api.github.com',
        path: '/repos/lbryio/lbry-desktop/releases/latest',
        headers: { 'user-agent': `LBRY/${localVersion}` },
      },
      res => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          requestLatestRelease(res.headers.location, true);
        } else {
          onSuccess(res);
        }
      }
    );

    if (alreadyRedirected) return;
    req.on('error', err => {
      console.log('Failed to get current version from GitHub. Error:', err);
      if (rendererWindow) {
        rendererWindow.webContents.send('version-info-received', null);
      }
    });
  };

  requestLatestRelease();
});

ipcMain.on('get-auth-token', event => {
  keytar.getPassword('LBRY', 'auth_token').then(token => {
    event.sender.send('auth-token-response', token ? token.toString().trim() : null);
  });
});

ipcMain.on('set-auth-token', (event, token) => {
  keytar.setPassword('LBRY', 'auth_token', token ? token.toString().trim() : null);
});

ipcMain.on('delete-auth-token', (event, password) => {
  keytar.deletePassword('LBRY', 'auth_token', password).then(res => {
    event.sender.send('delete-auth-token-response', res);
  });
});

ipcMain.on('get-password', event => {
  keytar.getPassword('LBRY', 'wallet_password').then(password => {
    event.sender.send('get-password-response', password ? password.toString() : null);
  });
});

ipcMain.on('set-password', (event, password) => {
  if (password || password === '') {
    keytar.setPassword('LBRY', 'wallet_password', password).then(res => {
      event.sender.send('get-password-response', res);
    });
  }
});

ipcMain.on('delete-password', (event, password) => {
  keytar.deletePassword('LBRY', 'wallet_password', password).then(res => {
    event.sender.send('get-password-response', res);
  });
});

process.on('uncaughtException', error => {
  console.log(error);
  dialog.showErrorBox('Error Encountered', `Caught error: ${error}`);
  appState.isQuitting = true;
  if (daemon) daemon.quit();
  app.exit(1);
});
