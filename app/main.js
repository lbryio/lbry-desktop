const {app, BrowserWindow, ipcMain} = require('electron');
const url = require('url');
const isDebug = process.env.NODE_ENV === 'development'

if (isDebug) {
  try
  {
    require('electron-debug')({showDevTools: true});
  }
  catch (err) // electron-debug is in devDependencies, but some
  {
    console.error(err)
  }
}

const path = require('path');
const jayson = require('jayson');
const semver = require('semver');
const https = require('https');
const keytar = require('keytar');
// tree-kill has better cross-platform handling of
// killing a process.  child-process.kill was unreliable
const kill = require('tree-kill');
const child_process = require('child_process');
const assert = require('assert');
const {version: localVersion} = require(app.getAppPath() + '/package.json');

const VERSION_CHECK_INTERVAL = 30 * 60 * 1000;
const LATEST_RELEASE_API_URL = 'https://api.github.com/repos/lbryio/lbry-app/releases/latest';


let client = jayson.client.http({
  host: 'localhost',
  port: 5279,
  path: '/lbryapi',
  timeout: 1000
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
// Also keep the daemon subprocess alive
let daemonSubprocess;

// This is set to true right before we try to shut the daemon subprocess --
// if it dies when we didn't ask it to shut down, we want to alert the user.
let daemonStopRequested = false;

// When a quit is attempted, we cancel the quit, do some preparations, then
// this is set to true and app.quit() is called again to quit for real.
let readyToQuit = false;

// If we receive a URI to open from an external app but there's no window to
// send it to, it's cached in this variable.
let openUri = null;

function processRequestedUri(uri) {
  // Windows normalizes URIs when they're passed in from other apps. On Windows,
  // this function tries to restore the original URI that was typed.
  //   - If the URI has no path, Windows adds a trailing slash. LBRY URIs
  //     can't have a slash with no path, so we just strip it off.
  //   - In a URI with a claim ID, like lbry://channel#claimid, Windows
  //     interprets the hash mark as an anchor and converts it to
  //     lbry://channel/#claimid. We remove the slash here as well.
  // On Linux and Mac, we just return the URI as given.

  if (process.platform == 'win32') {
    return uri.replace(/\/$/, '').replace('/#', '#');
  } else {
    return uri;
  }
}

function checkForNewVersion(callback) {
  function formatRc(ver) {
    // Adds dash if needed to make RC suffix semver friendly
    return ver.replace(/([^-])rc/, '$1-rc');
  }

  let result = '';
  const opts = {
    headers: {
      'User-Agent': `LBRY/${localVersion}`,
    }
  };

  const req = https.get(Object.assign(opts, url.parse(LATEST_RELEASE_API_URL)), (res) => {
    res.on('data', (data) => {
      result += data;
    });
    res.on('end', () => {
      const tagName = JSON.parse(result).tag_name;
      const [_, remoteVersion] = tagName.match(/^v([\d.]+(?:-?rc\d+)?)$/);
      if (!remoteVersion) {
        if (win) {
          win.webContents.send('version-info-received', null);
        }
      } else {
        const upgradeAvailable = semver.gt(formatRc(remoteVersion), formatRc(localVersion));
        if (win) {
          win.webContents.send('version-info-received', {remoteVersion, localVersion, upgradeAvailable});
        }
      }
    })
  });

  req.on('error', (err) => {
    console.log('Failed to get current version from GitHub. Error:', err);
    if (win) {
      win.webContents.send('version-info-received', null);
    }
  });
}

ipcMain.on('version-info-requested', checkForNewVersion);

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
    if (process.platform == 'darwin') {
      child = child_process.spawn('open', [fullPath], subprocOptions);
    } else if (process.platform == 'linux') {
      child = child_process.spawn('xdg-open', [fullPath], subprocOptions);
    } else if (process.platform == 'win32') {
      child = child_process.spawn(fullPath, Object.assign({}, subprocOptions, {shell: true}));
    }

    // Causes child process reference to be garbage collected, allowing main process to exit
    child.unref();
}

function getPidsForProcessName(name) {
  if (process.platform == 'win32') {
    const tasklistOut = child_process.execSync(`tasklist /fi "Imagename eq ${name}.exe" /nh`, {encoding: 'utf8'});
    if (tasklistOut.startsWith('INFO')) {
      return [];
    } else {
      return tasklistOut.match(/[^\r\n]+/g).map((line) => line.split(/\s+/)[1]); // Second column of every non-empty line
    }
  } else {
    const pgrepOut = child_process.spawnSync('pgrep', ['-x', name], {encoding: 'utf8'}).stdout;
    return pgrepOut.match(/\d+/g);
  }
}

function createWindow () {
  win = new BrowserWindow({backgroundColor: '#155B4A', minWidth: 800, minHeight: 600 }) //$color-primary

  win.maximize()
  if (isDebug) {
    win.webContents.openDevTools();
  }
  win.loadURL(`file://${__dirname}/dist/index.html`)
  if (openUri) { // We stored and received a URI that an external app requested before we had a window object
    win.webContents.on('did-finish-load', () => {
      win.webContents.send('open-uri-requested', openUri);
    });
  }

  win.on('closed', () => {
    win = null
  })
};

function handleOpenUriRequested(uri) {
  if (!win) {
    // Window not created yet, so store up requested URI for when it is
    openUri = uri;
  } else {
    if (win.isMinimized()) {
      win.restore();
    }
    win.focus();
    win.webContents.send('open-uri-requested', processRequestedUri(uri));
  }
}

function handleDaemonSubprocessExited() {
  console.log('The daemon has exited.');
  daemonSubprocess = null;
  if (!daemonStopRequested) {
    // We didn't request to stop the daemon, so display a
    // warning and schedule a quit.
    //
    // TODO: maybe it would be better to restart the daemon?
    if (win) {
      console.log('Did not request daemon stop, so quitting in 5 seconds.');
      win.loadURL(`file://${__dirname}/dist/warning.html`);
      setTimeout(quitNow, 5000);
    } else {
      console.log('Did not request daemon stop, so quitting.');
      quitNow();
    }
  }
}


function launchDaemon() {
  assert(!daemonSubprocess, 'Tried to launch daemon twice');

  if (process.env.LBRY_DAEMON) {
    executable = process.env.LBRY_DAEMON;
  } else {
    executable = path.join(__dirname, 'dist', 'lbrynet-daemon');
  }
  console.log('Launching daemon:', executable)
  daemonSubprocess = child_process.spawn(executable)
  // Need to handle the data event instead of attaching to
  // process.stdout because the latter doesn't work. I believe on
  // windows it buffers stdout and we don't get any meaningful output
  daemonSubprocess.stdout.on('data', (buf) => {console.log(String(buf).trim());});
  daemonSubprocess.stderr.on('data', (buf) => {console.log(String(buf).trim());});
  daemonSubprocess.on('exit', handleDaemonSubprocessExited);
}

/*
 * Quits without any preparation. When a quit is requested (either through the
 * interface or through app.quit()), we abort the quit, try to shut down the daemon,
 * and then call this to quit for real.
 */
function quitNow() {
  readyToQuit = true;
  app.quit();
}

if (process.platform != 'linux') {
  // On Linux, this is always returning true due to an Electron bug,
  // so for now we just don't support single-instance apps on Linux.
  const isSecondaryInstance = app.makeSingleInstance((argv) => {
    if (argv.length >= 2) {
      handleOpenUriRequested(argv[1]); // This will handle restoring and focusing the window
    } else if (win) {
      if (win.isMinimized()) {
        win.restore();
      }
      win.focus();
    }
  });

  if (isSecondaryInstance) { // We're not in the original process, so quit
    quitNow();
    return;
  }
}

app.on('ready', function(){
  launchDaemonIfNotRunning();
  createWindow();
});

function launchDaemonIfNotRunning() {
  // Check if the daemon is already running. If we get
  // an error its because its not running
  console.log('Checking for lbrynet daemon');
  client.request(
    'status', [],
    function (err, res) {
      if (err) {
        console.log('lbrynet daemon needs to be launched')
        launchDaemon();
      } else {
        console.log('lbrynet daemon is already running')
      }
    }
  );
}

/*
 * Last resort for killing unresponsive daemon instances.
 * Looks for any processes called "lbrynet-daemon" and
 * tries to force kill them.
 */
function forceKillAllDaemonsAndQuit() {
  console.log('Attempting to force kill any running lbrynet-daemon instances...');

  const daemonPids = getPidsForProcessName('lbrynet-daemon');
  if (!daemonPids) {
    console.log('No lbrynet-daemon found running.');
    quitNow();
  } else {
    console.log(`Found ${daemonPids.length} running daemon instances. Attempting to force kill...`);

    for (const pid of daemonPids) {
      let daemonKillAttemptsComplete = 0;
      kill(pid, 'SIGKILL', (err) => {
        daemonKillAttemptsComplete++;
        if (err) {
          console.log(`Failed to force kill daemon task with pid ${pid}. Error message: ${err.message}`);
        } else {
          console.log(`Force killed daemon task with pid ${pid}.`);
        }
        if (daemonKillAttemptsComplete >= daemonPids.length - 1) {
          quitNow();
        }
      });
    }
  }
}


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


app.on('before-quit', (event) => {
  if (!readyToQuit) {
    // We need to shutdown the daemon before we're ready to actually quit. This
    // event will be triggered re-entrantly once preparation is done.
    event.preventDefault();
    shutdownDaemonAndQuit();
  } else {
    console.log('Quitting.')
  }
});


app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
});

// When a quit is attempted, this is called. It attempts to shutdown the daemon,
// then calls quitNow() to quit for real.
function shutdownDaemonAndQuit(evenIfNotStartedByApp = false) {
  function doShutdown() {
    console.log('Shutting down daemon');
    daemonStopRequested = true;
    client.request('daemon_stop', [], (err, res) => {
      if (err) {
        console.log(`received error when stopping lbrynet-daemon. Error message: ${err.message}\n`);
        console.log('You will need to manually kill the daemon.');
      } else {
        console.log('Successfully stopped daemon via RPC call.')
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

function upgrade(event, installerPath) {
  app.on('quit', () => {
    console.log('Launching upgrade installer at', installerPath);
    // This gets triggered called after *all* other quit-related events, so
    // we'll only get here if we're fully prepared and quitting for real.
    openItem(installerPath);
  });

  if (win) {
    win.loadURL(`file://${__dirname}/dist/upgrade.html`);
  }

  shutdownDaemonAndQuit(true);
  // wait for daemon to shut down before upgrading
  // what to do if no shutdown in a long time?
  console.log('Update downloaded to', installerPath);
  console.log('The app will close, and you will be prompted to install the latest version of LBRY.');
  console.log('After the install is complete, please reopen the app.');
}

ipcMain.on('upgrade', upgrade);

app.setAsDefaultProtocolClient('lbry');

if (process.platform == 'darwin') {
  app.on('open-url', (event, uri) => {
    handleOpenUriRequested(uri);
  });
} else if (process.argv.length >= 2) {
  handleOpenUriRequested(process.argv[1]);
}

ipcMain.on('get-auth-token', (event) => {
  keytar.getPassword("LBRY", "auth_token").then(token => {
    event.sender.send('auth-token-response', token ? token.toString().trim() : null)
  });
});

ipcMain.on('set-auth-token', (event, token) => {
  keytar.setPassword("LBRY", "auth_token", token ? token.toString().trim() : null);
});