import React from 'react';
import ReactDOM from 'react-dom';
import lbry from './lbry.js';
import lighthouse from './lighthouse.js';
import App from './app.js';
import SplashScreen from './component/splash.js';


var init = function() {
  window.lbry = lbry;
  if (lbry.getClientSetting('debug')) {
    window.lighthouse = lighthouse;
  }

  var canvas = document.getElementById('canvas');

  ReactDOM.render(
    <SplashScreen message="Connecting" onLoadDone={function() {
      // Redirect to the claim code page if needed. Find somewhere better for this logic
      if (!localStorage.getItem('claimCodeDone') && window.location.search == '' || window.location.search == '?' || window.location.search == 'discover') {
        lbry.getBalance((balance) => {
          if (balance <= 0) {
            window.location.href = '?claim';
          } else {
            ReactDOM.render(<App/>, canvas);
          }
        });
      } else {
        if (localStorage.getItem('platform') === null) {
          lbry.getVersionInfo(({os_system}) => {
            localStorage.setItem('platform', os_system);
            ReactDOM.render(<App/>, canvas);
          });
        } else {
          ReactDOM.render(<App/>, canvas);
        }
      }
    }}/>,
    canvas
  );
};

init();
