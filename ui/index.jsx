import 'babel-polyfill';
import ErrorBoundary from 'component/errorBoundary';
import App from 'component/app';
import SnackBar from 'component/snackBar';
import SplashScreen from 'component/splash';
import * as ACTIONS from 'constants/action_types';
import { changeZoomFactor } from 'util/zoomWindow';
import { ipcRenderer, shell } from 'electron';
import * as remote from '@electron/remote';
import moment from 'moment';
import * as MODALS from 'constants/modal_types';
import React, { Fragment, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import {
  doDaemonReady,
  doAutoUpdate,
  doOpenModal,
  doHideModal,
  doToggle3PAnalytics,
  doUpdateDownloadProgress,
} from 'redux/actions/app';
import { isURIValid } from 'util/lbryURI';
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
import { getAuthToken, setAuthToken, doAuthTokenRefresh } from 'util/saved-passwords';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { DEFAULT_LANGUAGE, LBRY_API_URL } from 'config';

// Import 3rd-party styles before ours for the current way we are code-splitting.
import 'scss/third-party.scss';

// Import our app styles
// If a style is not necessary for the initial page load, it should be removed from `all.scss`
// and loaded dynamically in the component that consumes it
import 'scss/all.scss';

const startTime = Date.now();
analytics.startupEvent();

const { autoUpdater } = remote.require('electron-updater');
autoUpdater.logger = remote.require('electron-log');

if (LBRY_API_URL) {
  Lbryio.setLocalApi(LBRY_API_URL);
}

if (process.env.SEARCH_API_URL) {
  setSearchApi(process.env.SEARCH_API_URL);
}

doAuthTokenRefresh();

// We need to override Lbryio for getting/setting the authToken
// We interact with ipcRenderer to get the auth key from a users keyring
// We keep a local variable for authToken because `ipcRenderer.send` does not
// contain a response, so there is no way to know when it's been set
let authToken;
Lbryio.setOverride('setAuthToken', (authToken) => {
  setAuthToken(authToken);
  return authToken;
});

Lbryio.setOverride(
  'getAuthToken',
  () =>
    new Promise((resolve) => {
      const authTokenToReturn = authToken || getAuthToken();
      resolve(authTokenToReturn);
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

ipcRenderer.on('download-progress-update', (e, p) => {
  app.store.dispatch(doUpdateDownloadProgress(Math.round(p.percent * 100)));
});

ipcRenderer.on('download-update-complete', (e, c) => {
  app.store.dispatch({
    type: ACTIONS.UPGRADE_DOWNLOAD_COMPLETED,
    data: {
      path: c.path,
    },
  });
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

  useEffect(() => {
    if (persistDone) {
      const state = store.getState();
      const enabled = makeSelectClientSetting(SETTINGS.ENABLE_PRERELEASE_UPDATES)(state);
      if (enabled) {
        autoUpdater.allowPrerelease = true;
      }
    }
  }, [persistDone]);

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

  useEffect(() => {
    if (persistDone) {
      app.store.dispatch(doToggle3PAnalytics(null, true));
    }
  }, [persistDone]);

  useEffect(() => {
    if (readyToLaunch && persistDone) {
      if (DEFAULT_LANGUAGE) {
        app.store.dispatch(doFetchLanguage(DEFAULT_LANGUAGE));
      }
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
