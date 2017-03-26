const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const jayson = require('jayson');
// tree-kill has better cross-platform handling of
// killing a process.  child-process.kill was unreliable
const kill = require('tree-kill');
const child_process = require('child_process');
const assert = require('assert');


let client = jayson.client.http('http://localhost:5279/lbryapi');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
// Also keep the daemon subprocess alive
let daemonSubprocess;

// This is set to true right before we try to shut the daemon subprocess --
// if it dies when we didn't ask it to shut down, we want to alert the user.
let daemonSubprocessKillRequested = false;

// When a quit is attempted, we cancel the quit, do some preparations, then
// this is set to true and app.quit() is called again to quit for real.
let readyToQuit = false;

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
      child = child_process.spawn(fullPath, [], subprocOptions);
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
  win = new BrowserWindow({backgroundColor: '#155b4a'})
  win.maximize()
  //win.webContents.openDevTools()
  win.loadURL(`file://${__dirname}/dist/index.html`)
  win.on('closed', () => {
    win = null
  })
};

function handleDaemonSubprocessExited() {
  console.log('The daemon has exited.');
  daemonSubprocess = null;
  if (!daemonSubprocessKillRequested) {
    // We didn't stop the daemon subprocess on purpose, so display a
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
  console.log('lbrynet daemon has launched')
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
  if (daemonSubprocess) {
    console.log('Killing lbrynet-daemon process');
    daemonSubprocessKillRequested = true;
    kill(daemonSubprocess.pid, undefined, (err) => {
      console.log('Killed lbrynet-daemon process');
      quitNow();
    });
  } else if (evenIfNotStartedByApp) {
    console.log('Stopping lbrynet-daemon, even though app did not start it');
    client.request('daemon_stop', [], (err, res) => {
      if (err) {
        // We could get an error because the daemon is already stopped (good)
        // or because it's running but not responding properly (bad).
        // So try to force kill any daemons that are still running.

        console.log(`received error when stopping lbrynet-daemon. Error message: ${err.message}`);
        forceKillAllDaemonsAndQuit();
      } else {
        console.log('Successfully stopped daemon via RPC call.')
        quitNow();
      }
    });
  } else {
    console.log('Not killing lbrynet-daemon because app did not start it');
    quitNow();
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
