/* eslint-disable react/jsx-filename-extension */
import App from 'component/app';
import SnackBar from 'component/snackBar';
import SplashScreen from 'component/splash';
import * as ACTIONS from 'constants/action_types';
import { ipcRenderer, remote, shell } from 'electron';
import lbry from 'lbry';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  doConditionalAuthNavigate,
  doDaemonReady,
  doShowSnackBar,
  doAutoUpdate,
} from 'redux/actions/app';
import { doNavigate } from 'redux/actions/navigation';
import { doDownloadLanguages, doUpdateIsNightAsync } from 'redux/actions/settings';
import { doUserEmailVerify } from 'redux/actions/user';
import 'scss/all.scss';
import store from 'store';
import app from './app';
import analytics from './analytics';

const { autoUpdater } = remote.require('electron-updater');

autoUpdater.logger = remote.require('electron-log');

ipcRenderer.on('open-uri-requested', (event, uri, newSession) => {
  if (uri && uri.startsWith('lbry://')) {
    if (uri.startsWith('lbry://?verify=')) {
      let verification = {};
      try {
        verification = JSON.parse(atob(uri.substring(15)));
      } catch (error) {
        console.log(error);
      }
      if (verification.token && verification.recaptcha) {
        app.store.dispatch(doConditionalAuthNavigate(newSession));
        app.store.dispatch(doUserEmailVerify(verification.token, verification.recaptcha));
      } else {
        app.store.dispatch(doShowSnackBar({ message: 'Invalid Verification URI' }));
      }
    } else {
      app.store.dispatch(doNavigate('/show', { uri }));
    }
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

document.addEventListener('dragover', event => {
  event.preventDefault();
});
document.addEventListener('drop', event => {
  event.preventDefault();
});
document.addEventListener('click', event => {
  let { target } = event;
  while (target && target !== document) {
    if (target.matches('a') || target.matches('button')) {
      // TODO: Look into using accessiblity labels (this would also make the app more accessible)
      const hrefParts = window.location.href.split('#');
      const element = target.title || (target.textContent && target.textContent.trim());
      if (element) {
        analytics.track('CLICK', {
          target: element,
          location: hrefParts.length > 1 ? hrefParts[hrefParts.length - 1] : '/',
        });
      } else {
        analytics.track('UNMARKED_CLICK', {
          location: hrefParts.length > 1 ? hrefParts[hrefParts.length - 1] : '/',
          source: target.outerHTML,
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

const init = () => {
  autoUpdater.on('update-downloaded', () => {
    app.store.dispatch(doAutoUpdate());
  });

  autoUpdater.on('update-available', () => {
    console.log('Update available');
  });
  autoUpdater.on('update-not-available', () => {
    console.log('Update not available');
  });
  autoUpdater.on('update-downloaded', () => {
    console.log('Update downloaded');
    app.store.dispatch(doAutoUpdate());
  });

  app.store.dispatch(doUpdateIsNightAsync());
  app.store.dispatch(doDownloadLanguages());

  function onDaemonReady() {
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
