import ErrorBoundary from 'component/errorBoundary';
import App from 'component/app';
import SnackBar from 'component/snackBar';
import SplashScreen from 'component/splash';
// @if TARGET='app'
import moment from 'moment';
import { ipcRenderer, remote, shell } from 'electron';
import * as ACTIONS from 'constants/action_types';
// @endif
import * as MODALS from 'constants/modal_types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  doConditionalAuthNavigate,
  doDaemonReady,
  doAutoUpdate,
  doOpenModal,
  doHideModal,
} from 'redux/actions/app';
import { Lbry, doToast, isURIValid, setSearchApi } from 'lbry-redux';
import { doNavigate, doHistoryBack, doHistoryForward } from 'redux/actions/navigation';
import { doDownloadLanguages, doUpdateIsNightAsync } from 'redux/actions/settings';
import { doAuthenticate, Lbryio, rewards, doBlackListedOutpointsSubscribe } from 'lbryinc';
import 'scss/all.scss';
import store from 'store';
import pjson from 'package.json';
import app from './app';
import analytics from './analytics';
import doLogWarningConsoleMessage from './logWarningConsoleMessage';

const APPPAGEURL = 'lbry://?';

// @if TARGET='app'
const { autoUpdater } = remote.require('electron-updater');
autoUpdater.logger = remote.require('electron-log');
// @endif

if (process.env.LBRY_API_URL) {
  Lbryio.setLocalApi(process.env.LBRY_API_URL);
}

if (process.env.SEARCH_API_URL) {
  setSearchApi(process.env.SEARCH_API_URL);
}

// @if TARGET='app'
ipcRenderer.on('navigate-backward', () => {
  app.store.dispatch(doHistoryBack());
});

ipcRenderer.on('navigate-forward', () => {
  app.store.dispatch(doHistoryForward());
});
// @endif

// @if TARGET='web'
const SDK_API_URL = process.env.SDK_API_URL || 'https://api.lbry.tv/api/proxy';
Lbry.setDaemonConnectionString(SDK_API_URL);
// @endif

// We need to override Lbryio for getting/setting the authToken
// We interect with ipcRenderer to get the auth key from a users keyring
// We keep a local variable for authToken beacuse `ipcRenderer.send` does not
// contain a response, so there is no way to know when it's been set
let authToken;
Lbryio.setOverride(
  'setAuthToken',
  status =>
    new Promise(resolve => {
      Lbryio.call(
        'user',
        'new',
        {
          auth_token: '',
          language: 'en',
          app_id: status.installation_id,
        },
        'post'
      ).then(response => {
        if (!response.auth_token) {
          throw new Error(__('auth_token is missing from response'));
        }

        const newAuthToken = response.auth_token;
        authToken = newAuthToken;
        // @if TARGET='app'
        ipcRenderer.send('set-auth-token', authToken);
        // @endif
        resolve();
      });
    })
);

Lbryio.setOverride(
  'getAuthToken',
  () =>
    new Promise(resolve => {
      if (authToken) {
        resolve(authToken);
      } else {
        // @if TARGET='app'
        ipcRenderer.once('auth-token-response', (event, token) => {
          Lbryio.authToken = token;
          resolve(token);
        });

        ipcRenderer.send('get-auth-token');
        // @endif
      }
    })
);

rewards.setCallback('claimFirstRewardSuccess', () => {
  app.store.dispatch(doOpenModal(MODALS.FIRST_REWARD));
});

rewards.setCallback('rewardApprovalRequired', () => {
  app.store.dispatch(doOpenModal(MODALS.REWARD_APPROVAL_REQUIRED));
});

rewards.setCallback('claimRewardSuccess', () => {
  app.store.dispatch(doHideModal(MODALS.REWARD_APPROVAL_REQUIRED));
});

// @if TARGET='app'
ipcRenderer.on('open-uri-requested', (event, uri, newSession) => {
  if (uri && uri.startsWith('lbry://')) {
    if (uri.startsWith('lbry://?verify')) {
      app.store.dispatch(doConditionalAuthNavigate(newSession));
    } else if (uri.startsWith(APPPAGEURL)) {
      const navpage = uri.replace(APPPAGEURL, '').toLowerCase();
      app.store.dispatch(doNavigate(`/${navpage}`));
    } else if (isURIValid(uri)) {
      app.store.dispatch(doNavigate('/show', { uri }));
    } else {
      app.store.dispatch(
        doToast({
          message: __('Invalid LBRY URL requested'),
        })
      );
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

ipcRenderer.on('devtools-is-opened', () => {
  const logOnDevelopment = false;
  doLogWarningConsoleMessage(logOnDevelopment);
});
// @endif

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

      // Buttons that we want to track should use `data-id`
      // This prevents multiple buttons being grouped together if they have the same text
      const element =
        target.dataset.id || target.title || (target.textContent && target.textContent.trim());
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
      // @if TARGET='app'
      event.preventDefault();
      shell.openExternal(target.href);
      return;
      // @endif
    }
    target = target.parentNode;
  }
});

const init = () => {
  // @if TARGET='app'
  moment.locale(remote.app.getLocale());

  /* eslint-disable no-console */
  autoUpdater.on('error', error => {
    console.error(error.message);
  });

  if (['win32', 'darwin'].includes(process.platform)) {
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
  }
  /* eslint-enable no-console */

  app.store.dispatch(doUpdateIsNightAsync());
  // @endif

  app.store.dispatch(doDownloadLanguages());
  app.store.dispatch(doBlackListedOutpointsSubscribe());

  function onDaemonReady() {
    window.sessionStorage.setItem('loaded', 'y'); // once we've made it here once per session, we don't need to show splash again
    app.store.dispatch(doDaemonReady());

    ReactDOM.render(
      <Provider store={store}>
        <ErrorBoundary>
          <App />
          <SnackBar />
        </ErrorBoundary>
      </Provider>,
      document.getElementById('app')
    );
    // @if TARGET='web'
    // window.sessionStorage.removeItem('loaded');
    // @endif
  }

  if (window.sessionStorage.getItem('loaded') === 'y') {
    onDaemonReady();
  } else {
    ReactDOM.render(
      <Provider store={store}>
        <SplashScreen
          authenticate={() => app.store.dispatch(doAuthenticate(pjson.version))}
          onReadyToLaunch={onDaemonReady}
        />
      </Provider>,
      document.getElementById('app')
    );
  }
};

init();
