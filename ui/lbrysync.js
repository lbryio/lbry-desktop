import { ipcRenderer } from 'electron';
const BASE_URL = process.env.LBRYSYNC_BASE_URL || 'https://dev.lbry.id';
const SYNC_API_DOWN = 'sync_api_down';
const DUPLICATE_EMAIL = 'duplicate_email';
const UNKNOWN_ERROR = 'unknown_api_error';
const NOT_FOUND = 'not_found';
// console.log('process.env.', process.env.LBRYSYNC_BASE_URL);

const API_VERSION = 3;
const POST = 'POST';
const GET = 'GET';
// const API_URL = `${BASE_URL}/api/${API_VERSION}`;
const AUTH_ENDPOINT = '/auth/full';
const REGISTER_ENDPOINT = '/signup';
const WALLET_ENDPOINT = '/wallet';
const CLIENT_SALT_SEED = '/client-salt-seed';

const Lbrysync = {
  apiRequestHeaders: { 'Content-Type': 'application/json' },
  apiUrl: `${BASE_URL}/api/${API_VERSION}`,
  setApiHeader: (key, value) => {
    Lbrysync.apiRequestHeaders = Object.assign(Lbrysync.apiRequestHeaders, { [key]: value });
  },
};

export async function fetchSaltSeed(email) {
  const buff = Buffer.from(email.toString('utf8'));
  const emailParam = buff.toString('base64');
  const result = await callWithResult(GET, CLIENT_SALT_SEED, { email: emailParam });
  return result;
}

export async function getAuthToken(email, password, deviceId) {
  try {
    const result = await callWithResult(POST, AUTH_ENDPOINT, { email, password, deviceId });
    return { token: result };
  } catch (e) {
    return { error: e.message };
  }
}

export async function register(email, password, saltSeed) {
  try {
    const result = await callWithResult(POST, REGISTER_ENDPOINT, { email, password, clientSaltSeed: saltSeed });
    return result;
  } catch (e) {
    return { error: e.message };
  }
}

export async function pullWallet(token) {
  try {
    const result = await callWithResult(GET, WALLET_ENDPOINT, { token });
    return result;
  } catch (e) {
    return { error: e.message };
  }
}

// export async function pushWallet(walletState, hmac, token) {
//   // token?
//   const body = {
//     token: token,
//     encryptedWallet: walletState.encryptedWallet,
//     sequence: walletState.sequence,
//     hmac: hmac,
//   };
//   await callWithResult(POST, WALLET_ENDPOINT, { token, hmac, sequence });
// }

function callWithResult(method, endpoint, params = {}) {
  return new Promise((resolve, reject) => {
    return apiCall(
      method,
      endpoint,
      params,
      (result) => {
        console.log('cwr result', result);
        resolve(result);
      },
      (er) => {
        console.log('er', er);
        reject(er);
      }
    );
  });
}

function apiCall(method, endpoint, params, resolve, reject) {
  const options = {
    method: method,
  };
  let searchString = '';
  if (method === GET) {
    const search = new URLSearchParams(params);
    searchString = `?${search}`;
  } else if (method === POST) {
    options.body = JSON.stringify(params);
  }
  return fetch(`${Lbrysync.apiUrl}${endpoint}${searchString}`, options)
    .then(handleResponse)
    .then((response) => {
      console.log('response 200', response);
      return resolve(response);
    })
    .catch((r) => {
      console.log('r', r);
      return reject(r);
    });
}

function handleResponse(response) {
  if (response.status >= 200 && response.status < 300) {
    console.log('200+');
    return response.json();
  }

  if (response.status === 500) {
    return Promise.reject(500);
  }

  if (response.status === 409) {
    return Promise.reject(409);
  }

  if (response.status === 404) {
    return Promise.reject(404);
  }
  return Promise.reject(UNKNOWN_ERROR);
}

export default Lbrysync;
