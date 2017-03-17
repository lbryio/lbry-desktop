const {app, BrowserWindow, ipcMain, shell} = require('electron');
const path = require('path');
const jayson = require('jayson');
// tree-kill has better cross-platform handling of
// killing a process.  child-process.kill was unreliable
const kill = require('tree-kill');


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
  subpy = require('child_process').spawn(executable)
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


function shutdownDaemon() {
  if (subpy) {
    console.log('Killing lbrynet-daemon process');
    kill(subpy.pid, undefined, (err) => {
      console.log('Killed lbrynet-daemon process');
    });
  } else {
    client.request('stop', []);
    // TODO: If the daemon errors or times out when we make this request, find
    // the process and force quit it.
  }

  // Is it safe to start the installer before the daemon finishes running?
  // If not, we should wait until the daemon is closed before we start the install.
}

function shutdown() {
  /* if (!subpy) {
    // TODO: In this case, we didn't start the process so I'm hesitant
    //       to shut it down. We might want to send a stop command
    //       though instead of just letting it run.
    console.log('Not killing lbrynet daemon because we did not start it')
    return
  } */
  if (win) {
    win.loadURL(`file://${__dirname}/dist/quit.html`);
  }
  quitting = true;
  shutdownDaemon();
}

function upgrade(event, installerPath) {
  app.on('quit', () => {
    console.log('installerPath is', installerPath);
    shell.openItem(installerPath);
    console.log('after installerPath');
  });
  if (win) {
    win.loadURL(`file://${__dirname}/dist/upgrade.html`);
  }
  quitting = true;
  shutdownDaemon();
}

ipcMain.on('upgrade', upgrade);

ipcMain.on('shutdown', shutdown);