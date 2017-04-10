import {getLocal, getSession, setSession, setLocal} from './utils.js';
import lbry from './lbry.js';

const querystring = require('querystring');

const lbryio = {
  _accessToken: getLocal('accessToken'),
  _authenticationPromise: null,
  _user : null
};

const CONNECTION_STRING = 'http://localhost:8080/';

const mocks = {
  'reward_type.get': ({name}) => {
    return {
      name: 'link_github',
      title: 'Link your GitHub account',
      description: 'Link LBRY to your GitHub account',
      value: 50,
      claimed: false,
    };
  }
};

lbryio.call = function(resource, action, params={}, method='get') {
  return new Promise((resolve, reject) => {
    /* temp code for mocks */
    if (`${resource}.${action}` in mocks) {
      resolve(mocks[`${resource}.${action}`](params));
      return;
    }

    /* end temp */

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
          reject(new Error(response.error));
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
    const fullParams = {app_id: lbryio._accessToken, ...params};

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

lbryio.setAccessToken = (token) => {
  setLocal('accessToken', token)
  lbryio._accessToken = token
}

lbryio.authenticate = function() {
  if (lbryio._authenticationPromise === null) {
    lbryio._authenticationPromise = new Promise((resolve, reject) => {
      lbry.status().then(({installation_id}) => {

        //temp hack for installation_ids being wrong
        installation_id += "Y".repeat(96 - installation_id.length)

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

        if (!lbryio._accessToken) {
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
