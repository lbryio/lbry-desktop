const {app, BrowserWindow} = require('electron')
var jayson = require('jayson');
var client = jayson.client.http('http://localhost:5279/lbryapi');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
// Also keep the daemon subprocess alive
let subpy

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})
  win.maximize()

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/dist/index.html`)
  console.log('Loaded the index page')

  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
    console.log('Loaded the index page')
    subpy.kill('SIGINT');
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function(){
  // call python?
  subpy = require('child_process').spawn(`${__dirname}/dist/lbry`, ['--no-launch', '--log-to-console'], {stdio: ['ignore', process.stdout, process.stderr]})
  console.log('lbrynet daemon has launched')
  launchWindowWhenDaemonHasStarted();
})

// TODO: incorporate this into the LBRY module
function launchWindowWhenDaemonHasStarted() {    
    client.request(
	'status', [],
	function (err, res) {
	    // Did it all work ? 
	    if (err) {
		console.log(err); 
		console.log('Will try again in half a second');
		setTimeout(launchWindowWhenDaemonHasStarted, 500);
	    }
	    else {
		console.log(res); 
		createWindow();
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

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
