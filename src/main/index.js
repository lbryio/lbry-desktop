/* eslint-disable no-console */
// Module imports
import keytar from 'keytar-prebuild';
import SemVer from 'semver';
import findProcess from 'find-process';
import url from 'url';
import https from 'https';
import { shell, app, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import isDev from 'electron-is-dev';
import Daemon from './Daemon';
import createTray from './createTray';
import createWindow from './createWindow';

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
// eslint-disable-next-line no-unused-vars
let tray;
let daemon;

const appState = {};

const installExtensions = async () => {
  // eslint-disable-next-line import/no-extraneous-dependencies,global-require
  const installer = require('electron-devtools-installer');
  // eslint-disable-next-line import/no-extraneous-dependencies,global-require
  const devtronExtension = require('devtron');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(
      name => installer.default(installer[name], forceDownload),
      devtronExtension.install()
    )
  ).catch(console.log);
};

app.setAsDefaultProtocolClient('lbry');
app.setName('LBRY');

app.on('ready', async () => {
  const processList = await findProcess('name', 'lbrynet-daemon');
  const isDaemonRunning = processList.length > 0;
  if (!isDaemonRunning) {
    daemon = new Daemon();
    daemon.on('exit', () => {
      daemon = null;
      if (!appState.isQuitting) {
        dialog.showErrorBox(
          'Daemon has Exited',
          'The daemon may have encountered an unexpected error, or another daemon instance is already running. \n\n' +
            'For more information please visit: \n' +
            'https://lbry.io/faq/startup-troubleshooting'
        );
        app.quit();
      }
    });
    daemon.launch();
  }
  if (isDev) {
    await installExtensions();
  }
  rendererWindow = createWindow(appState);
  tray = createTray(rendererWindow);
});

app.on('activate', () => {
  rendererWindow.show();
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
        message:
          'LBRY has a pending upgrade. Please select "Yes" to install it on the prompt shown after this one.',
      },
      () => {
        app.quit();
      }
    );

    event.preventDefault();
    return;
  }

  appState.isQuitting = true;
  if (daemon) daemon.quit();
});

// https://electronjs.org/docs/api/app#event-will-finish-launching
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
  console.log(
    'The app will close, and you will be prompted to install the latest version of LBRY.'
  );
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

  const localVersion = app.getVersion();
  const latestReleaseAPIURL = 'https://api.github.com/repos/lbryio/lbry-app/releases/latest';
  const opts = {
    headers: {
      'User-Agent': `LBRY/${localVersion}`,
    },
  };
  let result = '';

  const req = https.get(Object.assign(opts, url.parse(latestReleaseAPIURL)), res => {
    res.on('data', data => {
      result += data;
    });
    res.on('end', () => {
      const tagName = JSON.parse(result).tag_name;
      const [, remoteVersion] = tagName.match(/^v([\d.]+(?:-?rc\d+)?)$/);
      if (!remoteVersion) {
        if (rendererWindow) {
          rendererWindow.webContents.send('version-info-received', null);
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
    });
  });

  req.on('error', err => {
    console.log('Failed to get current version from GitHub. Error:', err);
    if (rendererWindow) {
      rendererWindow.webContents.send('version-info-received', null);
    }
  });
});

ipcMain.on('get-auth-token', event => {
  keytar.getPassword('LBRY', 'auth_token').then(token => {
    event.sender.send('auth-token-response', token ? token.toString().trim() : null);
  });
});

ipcMain.on('set-auth-token', (event, token) => {
  keytar.setPassword('LBRY', 'auth_token', token ? token.toString().trim() : null);
});

process.on('uncaughtException', error => {
  dialog.showErrorBox('Error Encountered', `Caught error: ${error}`);
  appState.isQuitting = true;
  if (daemon) daemon.quit();
  app.exit(1);
});

// Force single instance application
const isSecondInstance = app.makeSingleInstance(argv => {
  if (
    (process.platform === 'win32' || process.platform === 'linux') &&
    String(argv[1]).startsWith('lbry')
  ) {
    let URI = argv[1];

    // Keep only command line / deep linked arguments
    // Windows normalizes URIs when they're passed in from other apps. On Windows, this tries to
    // restore the original URI that was typed.
    //   - If the URI has no path, Windows adds a trailing slash. LBRY URIs can't have a slash with no
    //     path, so we just strip it off.
    //   - In a URI with a claim ID, like lbry://channel#claimid, Windows interprets the hash mark as
    //     an anchor and converts it to lbry://channel/#claimid. We remove the slash here as well.
    if (process.platform === 'win32') {
      URI = URI.replace(/\/$/, '').replace('/#', '#');
    }

    rendererWindow.webContents.send('open-uri-requested', URI);
  }

  rendererWindow.show();
});

if (isSecondInstance) {
  app.exit();
}
