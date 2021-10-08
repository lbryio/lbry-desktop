// @flow
/*
  LBRY FIRST does not work due to api changes
 */
import 'proxy-polyfill';

const CHECK_LBRYFIRST_STARTED_TRY_NUMBER = 200;
//
// Basic LBRYFIRST connection config
// Offers a proxy to call LBRYFIRST methods

//
const LbryFirst: LbryFirstTypes = {
  isConnected: false,
  connectPromise: null,
  lbryFirstConnectionString: 'http://localhost:1337/rpc',
  apiRequestHeaders: { 'Content-Type': 'application/json' },

  // Allow overriding lbryFirst connection string (e.g. to `/api/proxy` for lbryweb)
  setLbryFirstConnectionString: (value: string) => {
    LbryFirst.lbryFirstConnectionString = value;
  },

  setApiHeader: (key: string, value: string) => {
    LbryFirst.apiRequestHeaders = Object.assign(LbryFirst.apiRequestHeaders, { [key]: value });
  },

  unsetApiHeader: key => {
    Object.keys(LbryFirst.apiRequestHeaders).includes(key) &&
      delete LbryFirst.apiRequestHeaders['key'];
  },
  // Allow overriding Lbry methods
  overrides: {},
  setOverride: (methodName, newMethod) => {
    LbryFirst.overrides[methodName] = newMethod;
  },
  getApiRequestHeaders: () => LbryFirst.apiRequestHeaders,

  // LbryFirst Methods
  status: (params = {}) => lbryFirstCallWithResult('status', params),
  stop: () => lbryFirstCallWithResult('stop', {}),
  version: () => lbryFirstCallWithResult('version', {}),

  // Upload to youtube
  upload: (params: { title: string, description: string, file_path: ?string } = {}) => {
    // Only upload when originally publishing for now
    if (!params.file_path) {
      return Promise.resolve();
    }

    const uploadParams: {
      Title: string,
      Description: string,
      FilePath: string,
      Category: string,
      Keywords: string,
    } = {
      Title: params.title,
      Description: params.description,
      FilePath: params.file_path,
      Category: '',
      Keywords: '',
    };

    return lbryFirstCallWithResult('youtube.Upload', uploadParams);
  },

  hasYTAuth: (token: string) => {
    const hasYTAuthParams = {};
    hasYTAuthParams.AuthToken = token;
    return lbryFirstCallWithResult('youtube.HasAuth', hasYTAuthParams);
  },

  ytSignup: () => {
    const emptyParams = {};
    return lbryFirstCallWithResult('youtube.Signup', emptyParams);
  },

  remove: () => {
    const emptyParams = {};
    return lbryFirstCallWithResult('youtube.Remove', emptyParams);
  },

  // Connect to lbry-first
  connect: () => {
    if (LbryFirst.connectPromise === null) {
      LbryFirst.connectPromise = new Promise((resolve, reject) => {
        let tryNum = 0;
        // Check every half second to see if the lbryFirst is accepting connections
        function checkLbryFirstStarted() {
          tryNum += 1;
          LbryFirst.status()
            .then(resolve)
            .catch(() => {
              if (tryNum <= CHECK_LBRYFIRST_STARTED_TRY_NUMBER) {
                setTimeout(checkLbryFirstStarted, tryNum < 50 ? 400 : 1000);
              } else {
                reject(new Error('Unable to connect to LBRY'));
              }
            });
        }

        checkLbryFirstStarted();
      });
    }

    // Flow thinks this could be empty, but it will always return a promise
    // $FlowFixMe
    return LbryFirst.connectPromise;
  },
};

function checkAndParse(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  }
  return response.json().then(json => {
    let error;
    if (json.error) {
      const errorMessage = typeof json.error === 'object' ? json.error.message : json.error;
      error = new Error(errorMessage);
    } else {
      error = new Error('Protocol error with unknown response signature');
    }
    return Promise.reject(error);
  });
}

export function apiCall(method: string, params: ?{}, resolve: Function, reject: Function) {
  const counter = new Date().getTime();
  const paramsArray = [params];
  const options = {
    method: 'POST',
    headers: LbryFirst.apiRequestHeaders,
    body: JSON.stringify({
      jsonrpc: '2.0',
      method,
      params: paramsArray,
      id: counter,
    }),
  };

  return fetch(LbryFirst.lbryFirstConnectionString, options)
    .then(checkAndParse)
    .then(response => {
      const error = response.error || (response.result && response.result.error);

      if (error) {
        return reject(error);
      }
      return resolve(response.result);
    })
    .catch(reject);
}

function lbryFirstCallWithResult(name: string, params: ?{} = {}) {
  return new Promise((resolve, reject) => {
    apiCall(
      name,
      params,
      result => {
        resolve(result);
      },
      reject
    );
  });
}

// This is only for a fallback
// If there is a LbryFirst method that is being called by an app, it should be added to /flow-typed/LbryFirst.js
const lbryFirstProxy = new Proxy(LbryFirst, {
  get(target: LbryFirstTypes, name: string) {
    if (name in target) {
      return target[name];
    }

    return (params = {}) =>
      new Promise((resolve, reject) => {
        apiCall(name, params, resolve, reject);
      });
  },
});

export default lbryFirstProxy;
