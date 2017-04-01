import React from 'react';
import ReactDOM from 'react-dom';
import lbry from './lbry.js';
import lbryio from './lbryio.js';
import lighthouse from './lighthouse.js';
import App from './app.js';
import SplashScreen from './component/splash.js';

const {remote} = require('electron');
const contextMenu = remote.require('./menu/context-menu');

lbry.showMenuIfNeeded();

window.addEventListener('contextmenu', (event) => {
  contextMenu.showContextMenu(remote.getCurrentWindow(), event.x, event.y,
                              lbry.getClientSetting('showDeveloperMenu'));
  event.preventDefault();
});

let init = function() {
  window.lbry = lbry;
  window.lighthouse = lighthouse;

  var canvas = document.getElementById('canvas');
  if (window.sessionStorage.getItem('loaded') == 'y') {
    ReactDOM.render(<App/>, canvas)
  } else {
    ReactDOM.render(
      (
        <SplashScreen message="Connecting" onLoadDone={function() {
          // There are a couple of conditions where we want to preempt loading the app and send the user to a
          // different page. TODO: Find a better place for this logic.

          if (!localStorage.getItem('claimCodeDone') && ['', '?', 'discover'].includes(window.location.search)) {
            lbry.getBalance((balance) => {
              if (balance <= 0) {
                window.location.href = '?claim';
              } else {
                ReactDOM.render(<App/>, canvas);
              }
            });
          } else {
            ReactDOM.render(<App/>, canvas);
          }
        }}/>
      ), canvas);
  }
};

init();
