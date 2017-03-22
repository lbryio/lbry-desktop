const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const jayson = require('jayson');
// tree-kill has better cross-platform handling of
// killing a process.  child-process.kill was unreliable
const kill = require('tree-kill');
const child_process = require('child_process');


let client = jayson.client.http('http://localhost:5279/lbryapi');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
// Also keep the daemon subprocess alive
let subpy
// set to true when the quitting sequence has started
let quitting = false;


function createWindow () {
  win = new BrowserWindow({backgroundColor: '#155b4a'})
  win.maximize()
  //win.webContents.openDevTools()
  win.loadURL(`file://${__dirname}/dist/index.html`)
  win.on('closed', () => {
    win = null
  })
};


function launchDaemon() {
  if (subpy) {
    return;
  }
  if (process.env.LBRY_DAEMON) {
    executable = process.env.LBRY_DAEMON;
  } else {
    executable = path.join(__dirname, 'dist', 'lbrynet-daemon');
  }
  console.log('Launching daemon: ' + executable)
  subpy = child_process.spawn(executable)
  // Need to handle the data event instead of attaching to
  // process.stdout because the latter doesn't work. I believe on
  // windows it buffers stdout and we don't get any meaningful output
  subpy.stdout.on('data', (buf) => {console.log(String(buf).trim());});
  subpy.stderr.on('data', (buf) => {console.log(String(buf).trim());});
  subpy.on('exit', () => {
    console.log('The daemon has exited. Quitting the app');
    subpy = null;
    if (quitting) {
      // If quitting is True it means that we were expecting the daemon
      // to be shutdown so we can quit right away
      app.quit();
    } else {
      // Otherwise, this shutdown was a surprise so display a warning
      // and schedule a quit
      //
      // TODO: maybe it would be better to restart the daemon?
      win.loadURL(`file://${__dirname}/dist/warning.html`);
      setTimeout(app.quit, 5000)
    }
  });
  console.log('lbrynet daemon has launched')
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
function forceKillAllDaemons() {
  console.log("Attempting to force kill any running lbrynet-daemon instances...");

  const fgrepOut = child_process.spawnSync('pgrep', ['-x', 'lbrynet-daemon'], {encoding: 'utf8'}).stdout;
  const daemonPids = fgrepOut.split(/[^\d]+/).filter((pid) => pid);
  if (!daemonPids) {
    console.log('No lbrynet-daemon found running.');
  } else {
    console.log(`Found ${daemonPids.length} running daemon instances. Attempting to force kill...`);

    for (const pid of daemonPids) {
      kill(pid, 'SIGKILL', (err) => {
        if (err) {
          console.log(`Failed to force kill running daemon with pid ${pid}. Error message: ${err.message}`);
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
  if (subpy == null) {
    return
  }
  event.preventDefault();
  shutdownDaemon();
})


app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})


function shutdownDaemon(evenIfNotStartedByApp = false) {
  if (subpy) {
    console.log('Killing lbrynet-daemon process');
    kill(subpy.pid, undefined, (err) => {
      console.log('Killed lbrynet-daemon process');
    });
  } else if (evenIfNotStartedByApp) {
    console.log('Stopping lbrynet-daemon, even though app did not start it');
    client.request('daemon_stop', [], (err, res) => {
      if (err) {
        // We could get an error because the daemon is already stopped (good)
        // or because it's running but not responding properly (bad).
        // So try to force kill any daemons that are still running.

        console.log('received error when stopping lbrynet-daemon. Error message: {err.message}');
        forceKillAllDaemons();
      }
    });
  } else {
    console.log('Not killing lbrynet-daemon because app did not start it')
  }

  // Is it safe to start the installer before the daemon finishes running?
  // If not, we should wait until the daemon is closed before we start the install.
}

function shutdown() {
  if (win) {
    win.loadURL(`file://${__dirname}/dist/quit.html`);
  }
  quitting = true;
  shutdownDaemon();
}

function upgrade(event, installerPath) {
  app.on('quit', () => {
    // shell.openItem doesn't reliably work from the app process, so run xdg-open directly
    child_process.spawn('xdg-open', [installerPath], {
      stdio: 'ignore',
    });
  });
  if (win) {
    win.loadURL(`file://${__dirname}/dist/upgrade.html`);
  }
  quitting = true;
  shutdownDaemon(true);
  // wait for daemon to shut down before upgrading
  // what to do if no shutdown in a long time?
  console.log('Update downloaded to ', installerPath);
  console.log('The app will close, and you will be prompted to install the latest version of LBRY.');
  console.log('After the install is complete, please reopen the app.');
}

ipcMain.on('upgrade', upgrade);

ipcMain.on('shutdown', shutdown);
