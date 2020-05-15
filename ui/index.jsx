import 'babel-polyfill';
import * as Sentry from '@sentry/browser';
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
import { doDaemonReady, doAutoUpdate, doOpenModal, doHideModal, doToggle3PAnalytics } from 'redux/actions/app';
import { Lbry, doToast, isURIValid, setSearchApi, apiCall } from 'lbry-redux';
import { doSetLanguage, doUpdateIsNightAsync } from 'redux/actions/settings';
import { Lbryio, rewards, doBlackListedOutpointsSubscribe, doFilteredOutpointsSubscribe } from 'lbryinc';
import { store, persistor, history } from 'store';
import app from './app';
import doLogWarningConsoleMessage from './logWarningConsoleMessage';
import { ConnectedRouter, push } from 'connected-react-router';
import { formatLbryUrlForWeb, formatInAppUrl } from 'util/url';
import { PersistGate } from 'redux-persist/integration/react';
import analytics from 'analytics';
import {
  getAuthToken,
  setAuthToken,
  doDeprecatedPasswordMigrationMarch2020,
  doAuthTokenRefresh,
} from 'util/saved-passwords';
import { X_LBRY_AUTH_TOKEN } from 'constants/token';
import { LBRY_TV_API } from 'config';

// Import our app styles
// If a style is not necessary for the initial page load, it should be removed from `all.scss`
// and loaded dynamically in the component that consumes it
import 'scss/all.scss';

// @if TARGET='web'
// These overrides can't live in lbrytv/ because they need to use the same instance of `Lbry`
import apiPublishCallViaWeb from 'lbrytv/setup/publish';

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
  console.warn('SDK_API_URL env var is deprecated. Use SDK_API_HOST instead');
}

let sdkAPIHost = process.env.SDK_API_HOST || process.env.SDK_API_URL;
// @if TARGET='web'
sdkAPIHost = LBRY_TV_API;
// @endif

export const SDK_API_PATH = `${sdkAPIHost}/api/v1`;
const proxyURL = `${SDK_API_PATH}/proxy`;

Lbry.setDaemonConnectionString(proxyURL);

Lbry.setOverride(
  'publish',
  params =>
    new Promise((resolve, reject) => {
      apiPublishCallViaWeb(
        apiCall,
        proxyURL,
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

// Fix to make sure old users' cookies are set to the correct domain
// This can be removed after March 11th, 2021
// https://github.com/lbryio/lbry-desktop/pull/3830
doDeprecatedPasswordMigrationMarch2020();
doAuthTokenRefresh();

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
        resolve(authToken);
      });
    })
);

Lbryio.setOverride(
  'getAuthToken',
  () =>
    new Promise(resolve => {
      const authTokenToReturn = authToken || getAuthToken();

      // @if TARGET='web'
      if (authTokenToReturn !== null) {
        Lbry.setApiHeader(X_LBRY_AUTH_TOKEN, authTokenToReturn);
      }
      // @endif

      resolve(authTokenToReturn);
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
  const [readyToLaunch, setReadyToLaunch] = useState(IS_WEB || sessionStorage.getItem('startup'));
  const [persistDone, setPersistDone] = useState(false);

  useEffect(() => {
    // @if TARGET='app'
    moment.locale(remote.app.getLocale());

    autoUpdater.on('error', error => {
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

  useEffect(() => {
    if (persistDone) {
      app.store.dispatch(doToggle3PAnalytics(null, true));
    }
  }, [persistDone]);

  useEffect(() => {
    if (readyToLaunch && persistDone) {
      sessionStorage.setItem('startup', true);
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
