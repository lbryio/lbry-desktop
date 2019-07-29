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
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { doConditionalAuthNavigate, doDaemonReady, doAutoUpdate, doOpenModal, doHideModal } from 'redux/actions/app';
import { Lbry, doToast, isURIValid, setSearchApi } from 'lbry-redux';
import { doInitLanguage, doUpdateIsNightAsync } from 'redux/actions/settings';
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
import cookie from 'cookie';
import { formatLbryUriForWeb } from 'util/uri';
import { PersistGate } from 'redux-persist/integration/react';

// Import our app styles
// If a style is not necessary for the initial page load, it should be removed from `all.scss`
// and loaded dynamically in the component that consumes it
import 'scss/all.scss';

const APPPAGEURL = 'lbry://?';
const COOKIE_EXPIRE_TIME = 60 * 60 * 24 * 365; // 1 year
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

        // @if TARGET='web'
        document.cookie = cookie.serialize('auth_token', authToken, {
          maxAge: COOKIE_EXPIRE_TIME,
        });
        // @endif
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
        // @if TARGET='web'
        const { auth_token: authToken } = cookie.parse(document.cookie);
        resolve(authToken);
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
      app.store.dispatch(push(`/$/${navpage}`));
    } else if (isURIValid(uri)) {
      const formattedUri = formatLbryUriForWeb(uri);
      app.store.dispatch(push(formattedUri));
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
  const haveLaunched = window.sessionStorage.getItem('loaded') === 'y';
  const [readyToLaunch, setReadyToLaunch] = useState(haveLaunched || IS_WEB);

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
    if (readyToLaunch) {
      app.store.dispatch(doUpdateIsNightAsync());
      app.store.dispatch(doDaemonReady());
      app.store.dispatch(doInitLanguage());
      app.store.dispatch(doBlackListedOutpointsSubscribe());
      app.store.dispatch(doFilteredOutpointsSubscribe());
      window.sessionStorage.setItem('loaded', 'y');
    }
  }, [readyToLaunch, haveLaunched]);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<div className="main--launching" />}>
        <div>
          {readyToLaunch ? (
            <ConnectedRouter history={history}>
              <ErrorBoundary>
                <App />
                <SnackBar />
              </ErrorBoundary>
            </ConnectedRouter>
          ) : (
            <SplashScreen
              authenticate={() => app.store.dispatch(doAuthenticate(pjson.version))}
              onReadyToLaunch={() => setReadyToLaunch(true)}
            />
          )}
        </div>
      </PersistGate>
    </Provider>
  );
}

ReactDOM.render(<AppWrapper />, document.getElementById('app'));
