import React from 'react';
import ReactDOM from 'react-dom';
import lbry from './lbry.js';
import lbryio from './lbryio.js';
import lighthouse from './lighthouse.js';
import App from './component/app/index.js';
import SplashScreen from './component/splash.js';
import SnackBar from './component/snack-bar.js';
import {AuthOverlay} from './component/auth.js';
import { Provider } from 'react-redux';
import store from 'store.js';
import { runTriggers } from 'triggers'
import {
  doDaemonReady,
  doChangePath,
} from 'actions/app'

const {remote} = require('electron');
const contextMenu = remote.require('./menu/context-menu');
const app = require('./app')

lbry.showMenuIfNeeded();

window.addEventListener('contextmenu', (event) => {
  contextMenu.showContextMenu(remote.getCurrentWindow(), event.x, event.y,
                              lbry.getClientSetting('showDeveloperMenu'));
  event.preventDefault();
});

window.addEventListener('popstate', (event) => {
  let pathname = document.location.pathname
  if (pathname.match(/dist/))
    pathname = '/discover'

  app.store.dispatch(doChangePath(pathname))
})

if (window.location.hash != '') {
  window.history.pushState({}, "Discover", location.hash.substring(2));
}

const initialState = app.store.getState();
app.store.subscribe(runTriggers);
runTriggers();

var init = function() {
  window.lbry = lbry;
  window.lighthouse = lighthouse;
  let canvas = document.getElementById('canvas');

  lbry.connect().then(function(isConnected) {
    lbryio.authenticate() //start auth process as soon as soon as we can get an install ID
  })

  function onDaemonReady() {
    app.store.dispatch(doDaemonReady())
    ReactDOM.render(<Provider store={store}><div>{ lbryio.enabled ? <AuthOverlay/> : '' }<App /><SnackBar /></div></Provider>, canvas)
  }

  if (window.sessionStorage.getItem('loaded') == 'y') {
    onDaemonReady();
  } else {
    ReactDOM.render(<SplashScreen message="Connecting" onLoadDone={onDaemonReady} />, canvas);
  }
};

init();
