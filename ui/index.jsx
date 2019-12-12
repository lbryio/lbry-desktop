import 'babel-polyfill';

import ErrorBoundary from 'component/errorBoundary';
import App from 'component/app';
import SnackBar from 'component/snackBar';
// @if TARGET='app'
import SplashScreen from 'component/splash';
import * as ACTIONS from 'constants/action_types';
// @endif
import { ipcRenderer, remote, shell } from 'electron';
import moment from 'moment';
import * as MODALS from 'constants/modal_types';
import React, { Fragment, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { doDaemonReady, doAutoUpdate, doOpenModal, doHideModal } from 'redux/actions/app';
import { Lbry, doToast, isURIValid, setSearchApi, apiCall } from 'lbry-redux';
import { doSetLanguage, doUpdateIsNightAsync } from 'redux/actions/settings';
import {
  doAuthenticate,
  Lbryio,
  rewards,
  doBlackListedOutpointsSubscribe,
  doFilteredOutpointsSubscribe,
} from 'lbryinc';
import { store, persistor, history } from 'store';
import pjson from 'package.json';
import app from './app';
import doLogWarningConsoleMessage from './logWarningConsoleMessage';
import { ConnectedRouter, push } from 'connected-react-router';
import { formatLbryUrlForWeb, formatInAppUrl } from 'util/url';
import { PersistGate } from 'redux-persist/integration/react';
import analytics from 'analytics';
import { getAuthToken, setAuthToken } from 'util/saved-passwords';
import { X_LBRY_AUTH_TOKEN } from 'constants/token';

// Import our app styles
// If a style is not necessary for the initial page load, it should be removed from `all.scss`
// and loaded dynamically in the component that consumes it
import 'scss/all.scss';

// @if TARGET='web'
// These overrides can't live in lbrytv/ because they need to use the same instance of `Lbry`
import apiPublishCallViaWeb from 'lbrytv/setup/publish';

const PROXY_PATH = 'api/v1/proxy';
export const SDK_API_URL = `${process.env.SDK_API_URL}/${PROXY_PATH}` || `https://api.lbry.tv/${PROXY_PATH}`;

Lbry.setDaemonConnectionString(SDK_API_URL);

Lbry.setOverride(
  'publish',
  params =>
    new Promise((resolve, reject) => {
      apiPublishCallViaWeb(
        apiCall,
        SDK_API_URL,
        Lbry.getApiRequestHeaders() && Object.keys(Lbry.getApiRequestHeaders()).includes(X_LBRY_AUTH_TOKEN)
          ? Lbry.getApiRequestHeaders()[X_LBRY_AUTH_TOKEN]
          : '',
        'publish',
        params,
        resolve,
        reject
      );
    })
);
// @endif

const startTime = Date.now();
analytics.startupEvent();

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

// We need to override Lbryio for getting/setting the authToken
// We interact with ipcRenderer to get the auth key from a users keyring
// We keep a local variable for authToken because `ipcRenderer.send` does not
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

        authToken = response.auth_token;
        setAuthToken(authToken);

        // @if TARGET='app'
        ipcRenderer.send('set-auth-token', authToken);
        // @endif

        resolve(authToken);
      });
    })
);

Lbryio.setOverride(
  'getAuthToken',
  () =>
    new Promise(resolve => {
      // @if TARGET='app'
      if (authToken) {
        resolve(authToken);
      }

      ipcRenderer.once('auth-token-response', (event, token) => {
        Lbryio.authToken = token;
        resolve(token);
      });

      ipcRenderer.send('get-auth-token');
      // @endif

      // @if TARGET='web'
      const authTokenToReturn = authToken || getAuthToken();

      if (authTokenToReturn !== null) {
        Lbry.setApiHeader(X_LBRY_AUTH_TOKEN, authTokenToReturn);
      }

      resolve(authTokenToReturn);
      // @endif
    })
);

rewards.setCallback('claimFirstRewardSuccess', () => {
  app.store.dispatch(doOpenModal(MODALS.FIRST_REWARD));
});

rewards.setCallback('claimRewardSuccess', () => {
  app.store.dispatch(doHideModal());
});

// @if TARGET='app'
ipcRenderer.on('open-uri-requested', (event, url, newSession) => {
  function handleError() {
    app.store.dispatch(
      doToast({
        message: __('Invalid LBRY URL requested'),
      })
    );
  }

  const path = url.slice('lbry://'.length);
  if (path.startsWith('?')) {
    const redirectUrl = formatInAppUrl(path);
    return app.store.dispatch(push(redirectUrl));
  }

  if (isURIValid(url)) {
    const formattedUrl = formatLbryUrlForWeb(url);
    analytics.openUrlEvent(formattedUrl);
    return app.store.dispatch(push(formattedUrl));
  }

  // If nothing redirected before here the url must be messed up
  handleError();
});

ipcRenderer.on('language-set', (event, language) => {
  app.store.dispatch(doSetLanguage(language));
});

ipcRenderer.on('open-menu', (event, uri) => {
  if (uri && uri.startsWith('/help')) {
    app.store.dispatch(push('/$/help'));
  }
});

const { dock } = remote.app;

ipcRenderer.on('window-is-focused', () => {
  if (!dock) return;
  app.store.dispatch({ type: ACTIONS.WINDOW_FOCUSED });
  dock.setBadge('');
});

ipcRenderer.on('devtools-is-opened', () => {
  doLogWarningConsoleMessage();
});

// Force exit mode for html5 fullscreen api
// See: https://github.com/electron/electron/issues/18188
remote.getCurrentWindow().on('leave-full-screen', event => {
  document.webkitExitFullscreen();
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

function AppWrapper() {
  // Splash screen and sdk setup not needed on web
  const [readyToLaunch, setReadyToLaunch] = useState(IS_WEB);
  const [persistDone, setPersistDone] = useState(false);

  useEffect(() => {
    // @if TARGET='app'
    moment.locale(remote.app.getLocale());

    autoUpdater.on('error', error => {
      console.error(error.message); // eslint-disable-line no-console
    });

    if (['win32', 'darwin'].includes(process.platform)) {
      autoUpdater.on('update-available', () => {
        console.log('Update available'); // eslint-disable-line no-console
      });
      autoUpdater.on('update-not-available', () => {
        console.log('Update not available'); // eslint-disable-line no-console
      });
      autoUpdater.on('update-downloaded', () => {
        console.log('Update downloaded'); // eslint-disable-line no-console
        app.store.dispatch(doAutoUpdate());
      });
    }
    // @endif
  }, []);

  useEffect(() => {
    if (readyToLaunch && persistDone) {
      app.store.dispatch(doUpdateIsNightAsync());
      app.store.dispatch(doDaemonReady());
      app.store.dispatch(doBlackListedOutpointsSubscribe());
      app.store.dispatch(doFilteredOutpointsSubscribe());

      const appReadyTime = Date.now();
      const timeToStart = appReadyTime - startTime;
      analytics.readyEvent(timeToStart);
    }
  }, [readyToLaunch, persistDone]);

  return (
    <Provider store={store}>
      <PersistGate
        persistor={persistor}
        onBeforeLift={() => setPersistDone(true)}
        loading={<div className="main--launching" />}
      >
        <Fragment>
          {readyToLaunch ? (
            <ConnectedRouter history={history}>
              <ErrorBoundary>
                <App />
                <SnackBar />
              </ErrorBoundary>
            </ConnectedRouter>
          ) : (
            <Fragment>
              <SplashScreen
                authenticate={() => app.store.dispatch(doAuthenticate(pjson.version))}
                onReadyToLaunch={() => setReadyToLaunch(true)}
              />
              <SnackBar />
            </Fragment>
          )}
        </Fragment>
      </PersistGate>
    </Provider>
  );
}

ReactDOM.render(<AppWrapper />, document.getElementById('app'));
