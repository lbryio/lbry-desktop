const {app, BrowserWindow} = require('electron');

var path = require('path');

var jayson = require('jayson');
// tree-kill has better cross-platform handling of
// killing a process.  child-process.kill was unreliable
var kill = require('tree-kill');

let client = jayson.client.http('http://localhost:5279/lbryapi');


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
  console.log(`${__dirname}`);
  executable = path.join(__dirname, 'dist', 'lbrynet-daemon');
  subpy = require('child_process').spawn(executable)//, {stdio: ['ignore', process.stdout, process.stderr]});
  // Need to handle the data event instead of attaching to
  // process.stdout because the latter doesn't work. I believe on
  // windows it buffers stdout and we don't get any meaningful output
  subpy.stdout.on('data', (buf) => {console.log(String(buf).trim());});
  subpy.stderr.on('data', (buf) => {console.log(String(buf).trim());});
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
    console.log('Checking for lbrynet daemon')
    client.request(
	'status', [],
	function (err, res) {
	    // Did it all work ? 
	    if (err) {
		console.log('lbrynet daemon needs to be launched')
		lauchDaemon();
	    } else {
		console.log('lbrynet daemon is already running')
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
    console.log('Killing lbrynet-daemon process');
    kill(subpy.pid, undefined, (err) => {
      console.log('Killed lbrynet-daemon process');
    });
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
