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
import {
  doChangePath,
  doDaemonReady,
  doHistoryPush
} from 'actions/app'
import {
  doFetchDaemonSettings
} from 'actions/settings'
import {
  doFileList
} from 'actions/file_info'
import parseQueryParams from 'util/query_params'

const {remote, ipcRenderer} = require('electron');
const contextMenu = remote.require('./menu/context-menu');
const app = require('./app')

lbry.showMenuIfNeeded();

window.addEventListener('contextmenu', (event) => {
  contextMenu.showContextMenu(remote.getCurrentWindow(), event.x, event.y,
                              lbry.getClientSetting('showDeveloperMenu'));
  event.preventDefault();
});

window.addEventListener('popstate', (event, param) => {
  const queryString = document.location.search
  const pathParts = document.location.pathname.split('/')
  const route = '/' + pathParts[pathParts.length - 1]

  if (route.match(/html$/)) return

  console.log('title should be set here, but it is not in popstate? TODO')

  app.store.dispatch(doChangePath(`${route}${queryString}`))
})

ipcRenderer.on('open-uri-requested', (event, uri) => {
  if (uri) {
    console.log('FIX ME do magic dispatch: ' + uri);
  }
});

const initialState = app.store.getState();

var init = function() {

  function onDaemonReady() {
    app.store.dispatch(doDaemonReady())
    window.sessionStorage.setItem('loaded', 'y'); //once we've made it here once per session, we don't need to show splash again
    app.store.dispatch(doHistoryPush({}, "Discover", "/discover"))
    app.store.dispatch(doFetchDaemonSettings())
    app.store.dispatch(doFileList())
    ReactDOM.render(<Provider store={store}><div>{ lbryio.enabled ? <AuthOverlay/> : '' }<App /><SnackBar /></div></Provider>, canvas)
  }

  if (window.sessionStorage.getItem('loaded') == 'y') {
    onDaemonReady();
  } else {
    ReactDOM.render(<SplashScreen message="Connecting" onLoadDone={onDaemonReady} />, canvas);
  }
};

init();
