import 'babel-polyfill';
import * as Sentry from '@sentry/browser';
import ErrorBoundary from 'component/errorBoundary';
import App from 'component/app';
import SnackBar from 'component/snackBar';
// @if TARGET='app'
import SplashScreen from 'component/splash';
import * as ACTIONS from 'constants/action_types';
import { changeZoomFactor } from 'util/zoomWindow';
// @endif
import { ipcRenderer, remote, shell } from 'electron';
import moment from 'moment';
import * as MODALS from 'constants/modal_types';
import React, { Fragment, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { doLbryReady, doAutoUpdate, doOpenModal, doHideModal, doToggle3PAnalytics } from 'redux/actions/app';
import { Lbry, isURIValid, apiCall } from 'lbry-redux';
import { setSearchApi } from 'redux/actions/search';
import { doSetLanguage, doFetchLanguage, doUpdateIsNightAsync } from 'redux/actions/settings';
import { Lbryio, doBlackListedOutpointsSubscribe, doFilteredOutpointsSubscribe } from 'lbryinc';
import rewards from 'rewards';
import { store, persistor, history } from 'store';
import app from './app';
import doLogWarningConsoleMessage from './logWarningConsoleMessage';
import { ConnectedRouter, push } from 'connected-react-router';
import { formatLbryUrlForWeb, formatInAppUrl } from 'util/url';
import { PersistGate } from 'redux-persist/integration/react';
import analytics from 'analytics';
import { doToast } from 'redux/actions/notifications';
import keycloak from 'util/keycloak';

import { getAuthToken, setAuthToken, doAuthTokenRefresh, getTokens, deleteAuthToken } from 'util/saved-passwords';
import { X_LBRY_AUTH_TOKEN } from 'constants/token';
import { LBRY_WEB_API, DEFAULT_LANGUAGE, LBRY_API_URL, LBRY_WEB_PUBLISH_API, URL as SITE_URL } from 'config';
// Import 3rd-party styles before ours for the current way we are code-splitting.
import 'scss/third-party.scss';

// Import our app styles
// If a style is not necessary for the initial page load, it should be removed from `all.scss`
// and loaded dynamically in the component that consumes it
// @if TARGET='app'
import 'scss/all.scss';
// @endif
// @if TARGET='web'
import 'web/theme';
// @endif
// @if TARGET='web'
// These overrides can't live in web/ because they need to use the same instance of `Lbry`
import apiPublishCallViaWeb from 'web/setup/publish';

// Sentry error logging setup
// Will only work if you have a SENTRY_AUTH_TOKEN env
// We still add code in analytics.js to send the error to sentry manually
// If it's caught by componentDidCatch in component/errorBoundary, it will not bubble up to this error reporter
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://1f3c88e2e4b341328a638e138a60fb73@sentry.lbry.tech/2',
    whitelistUrls: [/\/public\/ui.js/],
  });
}

if (process.env.SDK_API_URL) {
  console.warn('SDK_API_URL env var is deprecated. Use SDK_API_HOST instead'); // @eslint-disable-line
}

let sdkAPIHost = process.env.SDK_API_HOST || process.env.SDK_API_URL;
sdkAPIHost = LBRY_WEB_API;

export const SDK_API_PATH = `${sdkAPIHost}/api/v1`;
const proxyURL = `${SDK_API_PATH}/proxy`;
const publishURL = LBRY_WEB_PUBLISH_API; // || `${SDK_API_PATH}/proxy`;

Lbry.setDaemonConnectionString(proxyURL);

Lbry.setOverride(
  'publish',
  (params) =>
    new Promise((resolve, reject) => {
      apiPublishCallViaWeb(
        apiCall,
        publishURL,
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
const isDev = process.env.NODE_ENV !== 'production';

// @if TARGET='app'
const { autoUpdater } = remote.require('electron-updater');
autoUpdater.logger = remote.require('electron-log');
// @endif

if (LBRY_API_URL) {
  Lbryio.setLocalApi(LBRY_API_URL);
}

if (process.env.SEARCH_API_URL) {
  setSearchApi(process.env.SEARCH_API_URL);
}

if (getTokens().auth_token) {
  doAuthTokenRefresh();
}

// We need to override Lbryio for getting/setting the authToken
// We interact with ipcRenderer to get the auth key from a users keyring
// We keep a local variable for authToken because `ipcRenderer.send` does not
// contain a response, so there is no way to know when it's been set
Lbryio.setOverride('setAuthToken', (authToken) => {
  setAuthToken(authToken); // set the cookie to auth_token=
  return authToken;
});
Lbryio.setOverride('deleteAuthToken', () => deleteAuthToken());

Lbryio.setOverride(
  'getTokens',
  () =>
    new Promise((resolve) => {
      resolve(getTokens());
    })
);

Lbryio.setOverride(
  'getAuthToken',
  () =>
    new Promise((resolve) => {
      resolve(getAuthToken());
    })
);

rewards.setCallback('claimFirstRewardSuccess', () => {
  app.store.dispatch(doOpenModal(MODALS.FIRST_REWARD));
});

rewards.setCallback('claimRewardSuccess', (reward) => {
  if (reward && reward.type === rewards.TYPE_REWARD_CODE) {
    app.store.dispatch(doHideModal());
  }
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

ipcRenderer.on('zoom-window', (event, action) => {
  changeZoomFactor(action);
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
remote.getCurrentWindow().on('leave-full-screen', (event) => {
  document.webkitExitFullscreen();
});

document.addEventListener('click', (event) => {
  let { target } = event;

  while (target && target !== document) {
    if (target.matches('a[href^="http"]') || target.matches('a[href^="mailto"]')) {
      event.preventDefault();
      shell.openExternal(target.href);
      return;
    }
    target = target.parentNode;
  }
});
// @endif

document.addEventListener('dragover', (event) => {
  event.preventDefault();
});
document.addEventListener('drop', (event) => {
  event.preventDefault();
});

function AppWrapper() {
  // Splash screen and sdk setup not needed on web
  const [readyToLaunch, setReadyToLaunch] = useState(IS_WEB);
  const [persistDone, setPersistDone] = useState(false);
  const [keycloakReady, setKeycloakReady] = useState(false);

  // init?
  useEffect(() => {
    // @if TARGET='app'
    moment.locale(remote.app.getLocale());

    autoUpdater.on('error', (error) => {
      console.error(error.message); // eslint-disable-line no-console
    });

    if (['win32', 'darwin'].includes(process.platform) || !!process.env.APPIMAGE) {
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

  function initKeycloak() {
    console.dir(keycloak)
    keycloak.init(
      { onLoad: 'check-sso',
        silentCheckSsoFallback: false,
        didInit: true,
        redirectUri: isDev ? 'http://localhost:9090/' : `${SITE_URL}/`}
    ).then(function(authenticated) {
      setKeycloakReady(true);
      console.log('INIT: ', authenticated ? 'Authenticated' : 'Not Authenticated');
    }).catch(function() {
      console.log('INIT: FAILED');
    });
  }

  useEffect(() => {
    console.log('KCR RENDER', keycloakReady)
    if (!keycloakReady) {
      initKeycloak();
    }
  }, [keycloakReady]);

  // initKeycloak();

  useEffect(() => {
    if (persistDone) {
      app.store.dispatch(doToggle3PAnalytics(null, true));
    }
  }, [persistDone]);

  /**
   * We have assured we have the latest browser persist,
   * that daemon has started up,
   * and we have checked with keycloak for a token
   */
  useEffect(() => {
    if (readyToLaunch && persistDone && keycloakReady) { // keycloak ready
      if (DEFAULT_LANGUAGE) {
        app.store.dispatch(doFetchLanguage(DEFAULT_LANGUAGE));
      }
      app.store.dispatch(doUpdateIsNightAsync());
      app.store.dispatch(doLbryReady());
      app.store.dispatch(doBlackListedOutpointsSubscribe());
      app.store.dispatch(doFilteredOutpointsSubscribe());

      const appReadyTime = Date.now();
      const timeToStart = appReadyTime - startTime;
      analytics.readyEvent(timeToStart);
    }
  }, [readyToLaunch, persistDone, keycloakReady]);

  useEffect(() => {
    console.dir(keycloak);
  }, [keycloak]);

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
              <SplashScreen onReadyToLaunch={() => setReadyToLaunch(true)} />
              <SnackBar />
            </Fragment>
          )}
        </Fragment>
      </PersistGate>
    </Provider>
  );
}

ReactDOM.render(<AppWrapper />, document.getElementById('app'));
