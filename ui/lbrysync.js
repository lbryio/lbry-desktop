// @flow
/*
DeriveSecrets
POST /
 */
import { LBRYSYNC_API as BASE_URL } from 'config';
const SYNC_API_DOWN = 'sync_api_down';
const DUPLICATE_EMAIL = 'duplicate_email';
const UNKNOWN_ERROR = 'unknown_api_error';
const API_VERSION = 2;
// const API_URL = `${BASE_URL}/api/${API_VERSION}`;
const AUTH_ENDPOINT = '/auth/full';
const REGISTER_ENDPOINT = '/signup';
// const WALLET_ENDPOINT = '/wallet';
const Lbrysync = {
  apiRequestHeaders: { 'Content-Type': 'application/json' },
  apiUrl: `${BASE_URL}/api/${API_VERSION}`,
  setApiHeader: (key: string, value: string) => {
    Lbrysync.apiRequestHeaders = Object.assign(Lbrysync.apiRequestHeaders, { [key]: value });
  },
  // store state "registered email: email"
  register: async (email: string, password: string) => {
    try {
      const result = await callWithResult(REGISTER_ENDPOINT, { email, password });
      return result;
    } catch (e) {
      return e.message;
    }
  },
  // store state "lbrysynctoken: token"
  getAuthToken: async (email: string, password: string, deviceId: string) => {
    try {
      const result = await callWithResult(AUTH_ENDPOINT, { email, password, deviceId });
      return { token: result };
    } catch (e) {
      return { error: e.message };
    }
  },
};

function callWithResult(endpoint: string, params: ?{} = {}) {
  return new Promise((resolve, reject) => {
    apiCall(
      endpoint,
      params,
      (result) => {
        resolve(result);
      },
      reject
    );
  });
}

function apiCall(endpoint: string, params: ?{}, resolve: Function, reject: Function) {
  const options = {
    method: 'POST',
    body: JSON.stringify(params),
  };

  return fetch(`${Lbrysync.apiUrl}${endpoint}`, options)
    .then(handleResponse)
    .then((response) => {
      return resolve(response.result);
    })
    .catch(reject);
}

function handleResponse(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response.json());
  }

  if (response.status === 500) {
    return Promise.reject(SYNC_API_DOWN);
  }

  if (response.status === 409) {
    return Promise.reject(DUPLICATE_EMAIL);
  }
  return Promise.reject(UNKNOWN_ERROR);
}

export default Lbrysync;
