import React from 'react';
import ReactDOM from 'react-dom';
import lbry from './lbry.js';
import lbryio from './lbryio.js';
import lighthouse from './lighthouse.js';
import App from './app.js';
import SplashScreen from './component/splash.js';
import SnackBar from './component/snack-bar.js';
import {AuthOverlay} from './component/auth.js';

const {remote, ipcRenderer} = require('electron');
const contextMenu = remote.require('./menu/context-menu');

lbry.showMenuIfNeeded();

window.addEventListener('contextmenu', (event) => {
  contextMenu.showContextMenu(remote.getCurrentWindow(), event.x, event.y,
                              lbry.getClientSetting('showDeveloperMenu'));
  event.preventDefault();
});

let openUri = null;

function onOpenUriRequested(event, uri) {
  /**
   * If an external app requests a URI while we're still on the splash screen, we store it to
   * later pass into the App component.
   */
   openUri = uri;
};
ipcRenderer.on('open-uri-requested', onOpenUriRequested);


let init = function() {
  window.lbry = lbry;
  window.lighthouse = lighthouse;
  let canvas = document.getElementById('canvas');

  lbry.connect().then(function(isConnected) {
    lbryio.authenticate() //start auth process as soon as soon as we can get an install ID
  })

  function onDaemonReady() {
    window.sessionStorage.setItem('loaded', 'y'); //once we've made it here once per session, we don't need to show splash again
    ipcRenderer.removeListener('open-uri-requested', onOpenUriRequested); // <App /> will handle listening for URI requests once it's loaded
    ReactDOM.render(<div>{ lbryio.enabled ? <AuthOverlay/> : '' }<App {... openUri ? {openUri: openUri} : {}} /><SnackBar /></div>, canvas)
  }

  if (window.sessionStorage.getItem('loaded') == 'y') {
    onDaemonReady();
  } else {
    ReactDOM.render(<SplashScreen message="Connecting" onLoadDone={onDaemonReady} />, canvas);
  }
};

init();
