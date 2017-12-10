/* eslint-disable no-console */
// Module imports
import Path from 'path';
import Url from 'url';
import Jayson from 'jayson';
import Semver from 'semver';
import Https from 'https';
import Keytar from 'keytar';
import ChildProcess from 'child_process';
import Assert from 'assert';
import { app, BrowserWindow, globalShortcut, ipcMain, Menu, Tray } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import mainMenu from './menu/mainMenu';
import contextMenu from './menu/contextMenu';

const localVersion = app.getVersion();

// Debug configs
const isDevelopment = process.env.NODE_ENV === 'development';

// For now, log info messages in production for easier debugging of built apps
log.transports.file.level = 'info';

// Misc constants
const LATEST_RELEASE_API_URL = 'https://api.github.com/repos/lbryio/lbry-app/releases/latest';
const DAEMON_PATH = process.env.LBRY_DAEMON || Path.join(__static, 'daemon/lbrynet-daemon');
const rendererUrl = isDevelopment
  ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
  : `file://${__dirname}/index.html`;

const client = Jayson.client.http({
  host: 'localhost',
  port: 5279,
  path: '/',
  timeout: 1000,
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let rendererWindow;
// Also keep the daemon subprocess alive
let daemonSubprocess;

// This is set to true right before we try to shut the daemon subprocess --
// if it dies when we didn't ask it to shut down, we want to alert the user.
let daemonStopRequested = false;

// When a quit is attempted, we cancel the quit, do some preparations, then
// this is set to true and app.quit() is called again to quit for real.
let readyToQuit = false;

// If we receive a URI to open from an external app but there's no window to
// sendCredits it to, it's cached in this variable.
let openUri = null;

// Set this to true to minimize on clicking close
// false for normal action
let minimize = true;

// Keep the tray also, it is getting GC'd if put in createTray()
let tray = null;

function processRequestedUri(uri) {
  // Windows normalizes URIs when they're passed in from other apps. On Windows,
  // this function tries to restore the original URI that was typed.
  //   - If the URI has no path, Windows adds a trailing slash. LBRY URIs
  //     can't have a slash with no path, so we just strip it off.
  //   - In a URI with a claim ID, like lbry://channel#claimid, Windows
  //     interprets the hash mark as an anchor and converts it to
  //     lbry://channel/#claimid. We remove the slash here as well.
  // On Linux and Mac, we just return the URI as given.

  if (process.platform === 'win32') {
    return uri.replace(/\/$/, '').replace('/#', '#');
  }
  return uri;
}

/*
 * Replacement for Electron's shell.openItem. The Electron version doesn't
 * reliably work from the main process, and we need to be able to run it
 * when no windows are open.
 */
function openItem(fullPath) {
  const subprocOptions = {
    detached: true,
    stdio: 'ignore',
  };

  let child;
  if (process.platform === 'darwin') {
    child = ChildProcess.spawn('open', [fullPath], subprocOptions);
  } else if (process.platform === 'linux') {
    child = ChildProcess.spawn('xdg-open', [fullPath], subprocOptions);
  } else if (process.platform === 'win32') {
    child = ChildProcess.spawn(fullPath, Object.assign({}, subprocOptions, { shell: true }));
  }

  // Causes child process reference to be garbage collected, allowing main process to exit
  child.unref();
}
/*
 * Quits by first killing the daemon, the calling quitting for real.
 */
export function safeQuit() {
  minimize = false;
  app.quit();
}

function getMenuTemplate() {
  function getToggleItem() {
    if (rendererWindow.isVisible() && rendererWindow.isFocused()) {
      return {
        label: 'Hide LBRY App',
        click: () => rendererWindow.hide(),
      };
    }
    return {
      label: 'Show LBRY App',
      click: () => rendererWindow.show(),
    };
  }

  return [
    getToggleItem(),
    {
      label: 'Quit',
      click: () => safeQuit(),
    },
  ];
}

// This needs to be done as for linux the context menu doesn't update automatically(docs)
function updateTray() {
  const trayContextMenu = Menu.buildFromTemplate(getMenuTemplate());
  if (tray) {
    tray.setContextMenu(trayContextMenu);
  } else {
    console.log('How did update tray get called without a tray?');
  }
}

function createWindow() {
  // Disable renderer process's webSecurity on development to enable CORS.
  let windowConfiguration = {
    backgroundColor: '#155B4A',
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true,
  };

  windowConfiguration = isDevelopment
    ? {
        ...windowConfiguration,
        webPreferences: {
          webSecurity: false,
        },
      }
    : windowConfiguration;

  let window = new BrowserWindow(windowConfiguration);

  window.webContents.session.setUserAgent(`LBRY/${localVersion}`);

  window.maximize();
  if (isDevelopment) {
    window.webContents.openDevTools();
  }
  window.loadURL(rendererUrl);
  if (openUri) {
    // We stored and received a URI that an external app requested before we had a window object
    window.webContents.on('did-finish-load', () => {
      window.webContents.send('open-uri-requested', openUri, true);
    });
  }

  window.removeAllListeners();

  window.on('close', event => {
    if (minimize) {
      event.preventDefault();
      window.hide();
    }
  });

  window.on('closed', () => {
    window = null;
  });

  window.on('hide', () => {
    // Checks what to show in the tray icon menu
    if (minimize) updateTray();
  });

  window.on('show', () => {
    // Checks what to show in the tray icon menu
    if (minimize) updateTray();
  });

  window.on('blur', () => {
    // Checks what to show in the tray icon menu
    if (minimize) updateTray();

    // Unregisters Alt+F4 shortcut
    globalShortcut.unregister('Alt+F4');
  });

  window.on('focus', () => {
    // Checks what to show in the tray icon menu
    if (minimize) updateTray();

    // Registers shortcut for closing(quitting) the app
    globalShortcut.register('Alt+F4', () => safeQuit());

    window.webContents.send('window-is-focused', null);
  });

  mainMenu();

  return window;
}

function createTray() {
  // Minimize to tray logic follows:
  // Set the tray icon
  let iconPath;
  if (process.platform === 'darwin') {
    // Using @2x for mac retina screens so the icon isn't blurry
    // file name needs to include "Template" at the end for dark menu bar
    iconPath = Path.join(__static, '/img/fav/macTemplate@2x.png');
  } else {
    iconPath = Path.join(__static, '/img/fav/32x32.png');
  }

  tray = new Tray(iconPath);
  tray.setToolTip('LBRY App');
  tray.setTitle('LBRY');
  tray.on('double-click', () => {
    rendererWindow.show();
  });
}

function handleOpenUriRequested(uri) {
  if (!rendererWindow) {
    // Window not created yet, so store up requested URI for when it is
    openUri = processRequestedUri(uri);
  } else {
    if (rendererWindow.isMinimized()) {
      rendererWindow.restore();
    } else if (!rendererWindow.isVisible()) {
      rendererWindow.show();
    }

    rendererWindow.focus();
    rendererWindow.webContents.send('open-uri-requested', processRequestedUri(uri));
  }
}

/*
 * Quits without any preparation. When a quit is requested (either through the
 * interface or through app.quit()), we abort the quit, try to shut down the daemon,
 * and then call this to quit for real.
 */
function quitNow() {
  readyToQuit = true;
  safeQuit();
}

function handleDaemonSubprocessExited() {
  console.log('The daemon has exited.');
  daemonSubprocess = null;
  if (!daemonStopRequested) {
    // We didn't request to stop the daemon, so display a
    // warning and schedule a quit.
    //
    // TODO: maybe it would be better to restart the daemon?
    if (rendererWindow) {
      console.log('Did not request daemon stop, so quitting in 5 seconds.');
      rendererWindow.loadURL(`file://${__static}/warning.html`);
      setTimeout(quitNow, 5000);
    } else {
      console.log('Did not request daemon stop, so quitting.');
      quitNow();
    }
  }
}

function launchDaemon() {
  Assert(!daemonSubprocess, 'Tried to launch daemon twice');

  console.log('Launching daemon:', DAEMON_PATH);
  daemonSubprocess = ChildProcess.spawn(DAEMON_PATH);
  // Need to handle the data event instead of attaching to
  // process.stdout because the latter doesn't work. I believe on
  // windows it buffers stdout and we don't get any meaningful output
  daemonSubprocess.stdout.on('data', buf => {
    console.log(String(buf).trim());
  });
  daemonSubprocess.stderr.on('data', buf => {
    console.log(String(buf).trim());
  });
  daemonSubprocess.on('exit', handleDaemonSubprocessExited);
}

const isSecondaryInstance = app.makeSingleInstance(argv => {
  if (argv.length >= 2) {
    handleOpenUriRequested(argv[1]); // This will handle restoring and focusing the window
  } else if (rendererWindow) {
    if (rendererWindow.isMinimized()) {
      rendererWindow.restore();
    } else if (!rendererWindow.isVisible()) {
      rendererWindow.show();
    }
    rendererWindow.focus();
  }
});

if (isSecondaryInstance) {
  // We're not in the original process, so quit
  quitNow();
}

function launchDaemonIfNotRunning() {
  // Check if the daemon is already running. If we get
  // an error its because its not running
  console.log('Checking for lbrynet daemon');
  client.request('status', [], err => {
    if (err) {
      console.log('lbrynet daemon needs to be launched');
      launchDaemon();
    } else {
      console.log('lbrynet daemon is already running');
    }
  });
}

// Taken from webtorrent-desktop
function checkLinuxTraySupport(cb) {
  // Check that we're on Ubuntu (or another debian system) and that we have
  // libappindicator1.
  ChildProcess.exec('dpkg --get-selections libappindicator1', (err, stdout) => {
    if (err) return cb(err);
    // Unfortunately there's no cleaner way, as far as I can tell, to check
    // whether a debian package is installed:
    if (stdout.endsWith('\tinstall\n')) {
      return cb(null);
    }
    return cb(new Error('debian package not installed'));
  });
}

// When a quit is attempted, this is called. It attempts to shutdown the daemon,
// then calls quitNow() to quit for real.
function shutdownDaemonAndQuit(evenIfNotStartedByApp = false) {
  function doShutdown() {
    console.log('Shutting down daemon');
    daemonStopRequested = true;
    client.request('daemon_stop', [], err => {
      if (err) {
        console.log(`received error when stopping lbrynet-daemon. Error message: ${err.message}\n`);
        console.log('You will need to manually kill the daemon.');
      } else {
        console.log('Successfully stopped daemon via RPC call.');
        quitNow();
      }
    });
  }

  if (daemonSubprocess) {
    doShutdown();
  } else if (!evenIfNotStartedByApp) {
    console.log('Not killing lbrynet-daemon because app did not start it');
    quitNow();
  } else {
    doShutdown();
  }

  // Is it safe to start the installer before the daemon finishes running?
  // If not, we should wait until the daemon is closed before we start the install.
}

if (isDevelopment) {
  import('devtron')
    .then(({ install }) => {
      install();
      console.log('Added Extension: Devtron');
    })
    .catch(error => {
      console.error(error);
    });
  import('electron-devtools-installer')
    .then(({ default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS }) => {
      app.on('ready', () => {
        [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS].forEach(extension => {
          installExtension(extension)
            .then(name => console.log(`Added Extension: ${name}`))
            .catch(err => console.log('An error occurred: ', err));
        });
      });
    })
    .catch(error => {
      console.error(error);
    });
}

app.setAsDefaultProtocolClient('lbry');

app.on('ready', () => {
  launchDaemonIfNotRunning();
  if (process.platform === 'linux') {
    checkLinuxTraySupport(err => {
      if (!err) createTray();
      else minimize = false;
    });
  } else {
    createTray();
  }
  rendererWindow = createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', event => {
  if (!readyToQuit) {
    // We need to shutdown the daemon before we're ready to actually quit. This
    // event will be triggered re-entrantly once preparation is done.
    event.preventDefault();
    shutdownDaemonAndQuit();
  } else {
    console.log('Quitting.');
    if (autoUpdating) {
      minimize = false;
    }
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (rendererWindow === null) {
    createWindow();
  }
});

if (process.platform === 'darwin') {
  app.on('open-url', (event, uri) => {
    handleOpenUriRequested(uri);
  });
} else if (process.argv.length >= 2) {
  handleOpenUriRequested(process.argv[1]);
}

ipcMain.on('upgrade', (event, installerPath) => {
  app.on('quit', () => {
    console.log('Launching upgrade installer at', installerPath);
    // This gets triggered called after *all* other quit-related events, so
    // we'll only get here if we're fully prepared and quitting for real.
    openItem(installerPath);
  });

  if (rendererWindow) {
    rendererWindow.loadURL(`file://${__static}/upgrade.html`);
  }

  shutdownDaemonAndQuit(true);
  // wait for daemon to shut down before upgrading
  // what to do if no shutdown in a long time?
  console.log('Update downloaded to', installerPath);
  console.log(
    'The app will close, and you will be prompted to install the latest version of LBRY.'
  );
  console.log('After the install is complete, please reopen the app.');
});

ipcMain.on('version-info-requested', () => {
  function formatRc(ver) {
    // Adds dash if needed to make RC suffix semver friendly
    return ver.replace(/([^-])rc/, '$1-rc');
  }

  let result = '';
  const opts = {
    headers: {
      'User-Agent': `LBRY/${localVersion}`,
    },
  };

  const req = Https.get(Object.assign(opts, Url.parse(LATEST_RELEASE_API_URL)), res => {
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
        const upgradeAvailable = Semver.gt(formatRc(remoteVersion), formatRc(localVersion));
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

ipcMain.on('autoUpdate', () => {
  minimize = false;
  autoUpdater.quitAndInstall();
});

ipcMain.on('get-auth-token', event => {
  Keytar.getPassword('LBRY', 'auth_token').then(token => {
    event.sender.send('auth-token-response', token ? token.toString().trim() : null);
  });
});

ipcMain.on('set-auth-token', (event, token) => {
  Keytar.setPassword('LBRY', 'auth_token', token ? token.toString().trim() : null);
});

export { contextMenu };
