import {getLocal, getSession, setSession, setLocal} from './utils.js';
import lbry from './lbry.js';

const querystring = require('querystring');

const lbryio = {
  _accessToken: getLocal('accessToken'),
  _authenticationPromise: null,
  _user : null,
  enabled: false
};

// const CONNECTION_STRING = process.env.LBRY_APP_API_URL ? process.env.LBRY_APP_API_URL : 'https://api.lbry.io/';
const CONNECTION_STRING = 'https://api.lbry.io/';
const EXCHANGE_RATE_TIMEOUT = 20 * 60 * 1000;

lbryio.getExchangeRates = function() {
  return new Promise((resolve, reject) => {
    const cached = getSession('exchangeRateCache');
    if (!cached || Date.now() - cached.time > EXCHANGE_RATE_TIMEOUT) {
      lbryio.call('lbc', 'exchange_rate', {}, 'get', true).then(({lbc_usd, lbc_btc, btc_usd}) => {
        const rates = {lbc_usd, lbc_btc, btc_usd};
        setSession('exchangeRateCache', {
          rates: rates,
          time: Date.now(),
        });
        resolve(rates);
      });
    } else {
      resolve(cached.rates);
    }
  });
}

lbryio.call = function(resource, action, params={}, method='get', evenIfDisabled=false) { // evenIfDisabled is just for development, when we may have some calls working and some not
  return new Promise((resolve, reject) => {
    if (!lbryio.enabled && !evenIfDisabled && (resource != 'discover' || action != 'list')) {
      reject(new Error("LBRY internal API is disabled"))
      return
    }

    const xhr = new XMLHttpRequest;

    xhr.addEventListener('error', function (event) {
      reject(new Error("Something went wrong making an internal API call."));
    });


    xhr.addEventListener('timeout', function() {
      reject(new Error('XMLHttpRequest connection timed out'));
    });

    xhr.addEventListener('load', function() {
      const response = JSON.parse(xhr.responseText);

      if (!response.success) {
        if (reject) {
          let error = new Error(response.error);
          error.xhr = xhr;
          reject(error);
        } else {
          document.dispatchEvent(new CustomEvent('unhandledError', {
            detail: {
              connectionString: connectionString,
              method: action,
              params: params,
              message: response.error.message,
              ... response.error.data ? {data: response.error.data} : {},
            }
          }));
        }
      } else {
        resolve(response.data);
      }
    });

    // For social media auth:
    //const accessToken = localStorage.getItem('accessToken');
    //const fullParams = {...params, ... accessToken ? {access_token: accessToken} : {}};

    // Temp app ID based auth:
    const fullParams = {app_id: lbryio.getAccessToken(), ...params};

    if (method == 'get') {
      xhr.open('get', CONNECTION_STRING + resource + '/' + action + '?' + querystring.stringify(fullParams), true);
      xhr.send();
    } else if (method == 'post') {
      xhr.open('post', CONNECTION_STRING + resource + '/' + action, true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(querystring.stringify(fullParams));
    }
  });
};

lbryio.getAccessToken = () => {
  return getLocal('accessToken');
}

lbryio.setAccessToken = (token) => {
  setLocal('accessToken', token)
}

lbryio.authenticate = function() {
  if (!lbryio.enabled) {
    return new Promise((resolve, reject) => {
      resolve({
        ID: 1,
        HasVerifiedEmail: true
      })
    })
  }
  if (lbryio._authenticationPromise === null) {
    lbryio._authenticationPromise = new Promise((resolve, reject) => {
      lbry.status().then((response) => {

        let installation_id = response.installation_id;

        function setCurrentUser() {
          lbryio.call('user', 'me').then((data) => {
              lbryio.user = data
              resolve(data)
          }).catch(function(err) {
            lbryio.setAccessToken(null);
            if (!getSession('reloadedOnFailedAuth')) {
              setSession('reloadedOnFailedAuth', true)
              window.location.reload();
            } else {
              reject(err);
            }
          })
        }

        if (!lbryio.getAccessToken()) {
          lbryio.call('user', 'new', {
            language: 'en',
            app_id: installation_id,
          }, 'post').then(function(responseData) {
            if (!responseData.ID) {
              reject(new Error("Received invalid authentication response."));
            }
            lbryio.setAccessToken(installation_id)
            setCurrentUser()
          }).catch(function(error) {
            /*
               until we have better error code format, assume all errors are duplicate application id
               if we're wrong, this will be caught by later attempts to make a valid call
             */
            lbryio.setAccessToken(installation_id)
            setCurrentUser()
          })
        } else {
          setCurrentUser()
        }
        // if (!lbryio._
         //(data) => {
          // resolve(data)
          // localStorage.setItem('accessToken', ID);
          // localStorage.setItem('appId', installation_id);
          // this.setState({
          //   registrationCheckComplete: true,
          //   justRegistered: true,
          // });
        //});
        // lbryio.call('user_install', 'exists', {app_id: installation_id}).then((userExists) => {
        //   // TODO: deal with case where user exists already with the same app ID, but we have no access token.
        //   // Possibly merge in to the existing user with the same app ID.
        // })
      }).catch(reject);
    });
  }
  return lbryio._authenticationPromise;
}

export default lbryio;
