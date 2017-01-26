const {app, BrowserWindow} = require('electron')
var jayson = require('jayson');
var client = jayson.client.http('http://localhost:5279/lbryapi');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
// Also keep the daemon subprocess alive
let subpy
// set to true when the quitting sequence has started
let quitting = false;

function createWindow () {
  // Create the browser window.
  //win = new BrowserWindow({x: 0, y: 0, width: 1440, height: 414, backgroundColor: '#155b4a'})
  win = new BrowserWindow({backgroundColor: '#155b4a'})
  win.maximize()

  //win.webContents.openDevTools()

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/dist/index.html`)

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
};

function lauchDaemon() {
  if (subpy) {
    return;
  }
  subpy = require('child_process').spawn(`${__dirname}/dist/lbry`, ['--no-launch', '--log-to-console'], {stdio: ['ignore', process.stdout, process.stderr]})
  subpy.on('exit', () => {
    console.log('The daemon has exited. Quitting the app');
    subpy = null;
    if (quitting) {
      app.quit();
    } else {
      win.loadURL(`file://${__dirname}/dist/warning.html`);
      setTimeout(app.quit, 5000)
    }
  });
  console.log('lbrynet daemon has launched')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function(){
    // Check if the daemon is already running. If we get
    // an error its because its not running
    client.request(
	'status', [],
	function (err, res) {
	    // Did it all work ? 
	    if (err) {
		lauchDaemon();
	    }
	}
    );
    createWindow();
});


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', (event) => {
  if (subpy != null) {
    event.preventDefault()
    if (win) {
      win.loadURL(`file://${__dirname}/dist/quit.html`);
    }
    quitting = true;  
    subpy.kill('SIGINT');
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
