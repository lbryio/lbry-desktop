/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import App from 'component/app';
import SnackBar from 'component/snackBar';
import { Provider } from 'react-redux';
import store from 'store';
import SplashScreen from 'component/splash';
import { doDaemonReady } from 'redux/actions/app';
import { doNavigate } from 'redux/actions/navigation';
import { doDownloadLanguages } from 'redux/actions/settings';
import * as ACTIONS from 'constants/action_types';
import amplitude from 'amplitude-js';
import lbry from 'lbry';
import 'scss/all.scss';
import { ipcRenderer, remote, shell } from 'electron';

const { contextMenu } = remote.require('./main.js');

window.addEventListener('contextmenu', event => {
  contextMenu.showContextMenu(
    remote.getCurrentWindow(),
    event.x,
    event.y,
    app.env === 'development'
  );
  event.preventDefault();
});

ipcRenderer.on('open-uri-requested', (event, uri) => {
  if (uri && uri.startsWith('lbry://')) {
    app.store.dispatch(doNavigate('/show', { uri }));
  }
});

ipcRenderer.on('open-menu', (event, uri) => {
  if (uri && uri.startsWith('/help')) {
    app.store.dispatch(doNavigate('/help'));
  }
});

const { dock } = remote.app;

ipcRenderer.on('window-is-focused', () => {
  if (!dock) return;
  app.store.dispatch({ type: ACTIONS.WINDOW_FOCUSED });
  dock.setBadge('');
});

document.addEventListener('click', event => {
  let { target } = event;
  while (target && target !== document) {
    if (target.matches('a') || target.matches('button')) {
      // TODO: Look into using accessiblity labels (this would also make the app more accessible)
      const hrefParts = window.location.href.split('#');
      const element = target.title || (target.text && target.text.trim());
      if (element) {
        amplitude.getInstance().logEvent('CLICK', {
          target: element,
          location: hrefParts.length > 1 ? hrefParts[hrefParts.length - 1] : '/',
        });
      } else {
        amplitude.getInstance().logEvent('UNMARKED_CLICK', {
          location: hrefParts.length > 1 ? hrefParts[hrefParts.length - 1] : '/',
        });
      }
    }
    if (target.matches('a[href^="http"]') || target.matches('a[href^="mailto"]')) {
      event.preventDefault();
      shell.openExternal(target.href);
      return;
    }
    target = target.parentNode;
  }
});

const init = function initializeReactApp() {
  app.store.dispatch(doDownloadLanguages());

  function onDaemonReady() {
    lbry.status().then(info => {
      amplitude.getInstance().init(
        // Amplitude API Key
        '0b130efdcbdbf86ec2f7f9eff354033e',
        info.lbry_id,
        null,
        () => {
          window.sessionStorage.setItem('loaded', 'y'); // once we've made it here once per session, we don't need to show splash again
          app.store.dispatch(doDaemonReady());

          ReactDOM.render(
            <Provider store={store}>
              <div>
                <App />
                <SnackBar />
              </div>
            </Provider>,
            document.getElementById('app')
          );
        }
      );
    });
  }

  if (window.sessionStorage.getItem('loaded') === 'y') {
    onDaemonReady();
  } else {
    ReactDOM.render(
      <Provider store={store}>
        <SplashScreen onReadyToLaunch={onDaemonReady} />
      </Provider>,
      document.getElementById('app')
    );
  }
};

init();
