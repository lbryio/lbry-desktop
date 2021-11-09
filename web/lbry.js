// Disabled flow in this copy. This copy is for uncompiled web server ES5 require()s.
require('proxy-polyfill');

const CHECK_DAEMON_STARTED_TRY_NUMBER = 200;
//
// Basic LBRY sdk connection config
// Offers a proxy to call LBRY sdk methods

//
const Lbry = {
  isConnected: false,
  connectPromise: null,
  daemonConnectionString: 'http://localhost:5279',
  alternateConnectionString: '',
  methodsUsingAlternateConnectionString: [],
  apiRequestHeaders: { 'Content-Type': 'application/json-rpc' },

  // Allow overriding daemon connection string (e.g. to `/api/proxy` for lbryweb)
  setDaemonConnectionString: (value) => {
    Lbry.daemonConnectionString = value;
  },

  setApiHeader: (key, value) => {
    Lbry.apiRequestHeaders = Object.assign(Lbry.apiRequestHeaders, { [key]: value });
  },

  unsetApiHeader: (key) => {
    Object.keys(Lbry.apiRequestHeaders).includes(key) && delete Lbry.apiRequestHeaders['key'];
  },
  // Allow overriding Lbry methods
  overrides: {},
  setOverride: (methodName, newMethod) => {
    Lbry.overrides[methodName] = newMethod;
  },
  getApiRequestHeaders: () => Lbry.apiRequestHeaders,

  // Returns a human readable media type based on the content type or extension of a file that is returned by the sdk
  getMediaType: (contentType, fileName) => {
    if (fileName) {
      const formats = [
        [/\.(mp4|m4v|webm|flv|f4v|ogv)$/i, 'video'],
        [/\.(mp3|m4a|aac|wav|flac|ogg|opus)$/i, 'audio'],
        [/\.(jpeg|jpg|png|gif|svg|webp)$/i, 'image'],
        [/\.(h|go|ja|java|js|jsx|c|cpp|cs|css|rb|scss|sh|php|py)$/i, 'script'],
        [/\.(html|json|csv|txt|log|md|markdown|docx|pdf|xml|yml|yaml)$/i, 'document'],
        [/\.(pdf|odf|doc|docx|epub|org|rtf)$/i, 'e-book'],
        [/\.(stl|obj|fbx|gcode)$/i, '3D-file'],
        [/\.(cbr|cbt|cbz)$/i, 'comic-book'],
        [/\.(lbry)$/i, 'application'],
      ];

      const res = formats.reduce((ret, testpair) => {
        switch (testpair[0].test(ret)) {
          case true:
            return testpair[1];
          default:
            return ret;
        }
      }, fileName);
      return res === fileName ? 'unknown' : res;
    } else if (contentType) {
      // $FlowFixMe
      return /^[^/]+/.exec(contentType)[0];
    }

    return 'unknown';
  },

  //
  // Lbry SDK Methods
  // https://lbry.tech/api/sdk
  //
  status: (params = {}) => daemonCallWithResult('status', params),
  stop: () => daemonCallWithResult('stop', {}),
  version: () => daemonCallWithResult('version', {}),

  // Claim fetching and manipulation
  resolve: (params) => daemonCallWithResult('resolve', params),
  get: (params) => daemonCallWithResult('get', params),
  claim_search: (params) => daemonCallWithResult('claim_search', params),
  claim_list: (params) => daemonCallWithResult('claim_list', params),
  channel_create: (params) => daemonCallWithResult('channel_create', params),
  channel_update: (params) => daemonCallWithResult('channel_update', params),
  channel_import: (params) => daemonCallWithResult('channel_import', params),
  channel_list: (params) => daemonCallWithResult('channel_list', params),
  stream_abandon: (params) => daemonCallWithResult('stream_abandon', params),
  stream_list: (params) => daemonCallWithResult('stream_list', params),
  channel_abandon: (params) => daemonCallWithResult('channel_abandon', params),
  channel_sign: (params) => daemonCallWithResult('channel_sign', params),
  support_create: (params) => daemonCallWithResult('support_create', params),
  support_list: (params) => daemonCallWithResult('support_list', params),
  stream_repost: (params) => daemonCallWithResult('stream_repost', params),
  collection_resolve: (params) => daemonCallWithResult('collection_resolve', params),
  collection_list: (params) => daemonCallWithResult('collection_list', params),
  collection_create: (params) => daemonCallWithResult('collection_create', params),
  collection_update: (params) => daemonCallWithResult('collection_update', params),

  // File fetching and manipulation
  file_list: (params = {}) => daemonCallWithResult('file_list', params),
  file_delete: (params = {}) => daemonCallWithResult('file_delete', params),
  file_set_status: (params = {}) => daemonCallWithResult('file_set_status', params),
  blob_delete: (params = {}) => daemonCallWithResult('blob_delete', params),
  blob_list: (params = {}) => daemonCallWithResult('blob_list', params),

  // Wallet utilities
  wallet_balance: (params = {}) => daemonCallWithResult('wallet_balance', params),
  wallet_decrypt: () => daemonCallWithResult('wallet_decrypt', {}),
  wallet_encrypt: (params = {}) => daemonCallWithResult('wallet_encrypt', params),
  wallet_unlock: (params = {}) => daemonCallWithResult('wallet_unlock', params),
  wallet_list: (params = {}) => daemonCallWithResult('wallet_list', params),
  wallet_send: (params = {}) => daemonCallWithResult('wallet_send', params),
  wallet_status: (params = {}) => daemonCallWithResult('wallet_status', params),
  address_is_mine: (params = {}) => daemonCallWithResult('address_is_mine', params),
  address_unused: (params = {}) => daemonCallWithResult('address_unused', params),
  address_list: (params = {}) => daemonCallWithResult('address_list', params),
  transaction_list: (params = {}) => daemonCallWithResult('transaction_list', params),
  utxo_release: (params = {}) => daemonCallWithResult('utxo_release', params),
  support_abandon: (params = {}) => daemonCallWithResult('support_abandon', params),
  purchase_list: (params = {}) => daemonCallWithResult('purchase_list', params),
  txo_list: (params = {}) => daemonCallWithResult('txo_list', params),

  sync_hash: (params = {}) => daemonCallWithResult('sync_hash', params),
  sync_apply: (params = {}) => daemonCallWithResult('sync_apply', params),

  // Preferences
  preference_get: (params = {}) => daemonCallWithResult('preference_get', params),
  preference_set: (params = {}) => daemonCallWithResult('preference_set', params),

  // Comments
  comment_list: (params = {}) => daemonCallWithResult('comment_list', params),
  comment_create: (params = {}) => daemonCallWithResult('comment_create', params),
  comment_hide: (params = {}) => daemonCallWithResult('comment_hide', params),
  comment_abandon: (params = {}) => daemonCallWithResult('comment_abandon', params),
  comment_update: (params = {}) => daemonCallWithResult('comment_update', params),

  // Connect to the sdk
  connect: () => {
    if (Lbry.connectPromise === null) {
      Lbry.connectPromise = new Promise((resolve, reject) => {
        let tryNum = 0;
        // Check every half second to see if the daemon is accepting connections
        function checkDaemonStarted() {
          tryNum += 1;
          Lbry.status()
            .then(resolve)
            .catch(() => {
              if (tryNum <= CHECK_DAEMON_STARTED_TRY_NUMBER) {
                setTimeout(checkDaemonStarted, tryNum < 50 ? 400 : 1000);
              } else {
                reject(new Error('Unable to connect to LBRY'));
              }
            });
        }

        checkDaemonStarted();
      });
    }

    // Flow thinks this could be empty, but it will always reuturn a promise
    // $FlowFixMe
    return Lbry.connectPromise;
  },

  publish: (params = {}) =>
    new Promise((resolve, reject) => {
      if (Lbry.overrides.publish) {
        Lbry.overrides.publish(params).then(resolve, reject);
      } else {
        apiCall('publish', params, resolve, reject);
      }
    }),
};

function checkAndParse(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  }
  return response.json().then((json) => {
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

function apiCall(method, params, resolve, reject) {
  const counter = new Date().getTime();
  const options = {
    method: 'POST',
    headers: Lbry.apiRequestHeaders,
    body: JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
      id: counter,
    }),
  };

  const connectionString = Lbry.methodsUsingAlternateConnectionString.includes(method)
    ? Lbry.alternateConnectionString
    : Lbry.daemonConnectionString;
  return fetch(connectionString + '?m=' + method, options)
    .then(checkAndParse)
    .then((response) => {
      const error = response.error || (response.result && response.result.error);

      if (error) {
        return reject(error);
      }
      return resolve(response.result);
    })
    .catch(reject);
}

function daemonCallWithResult(name, params = {}) {
  return new Promise((resolve, reject) => {
    apiCall(
      name,
      params,
      (result) => {
        resolve(result);
      },
      reject
    );
  });
}

// This is only for a fallback
// If there is a Lbry method that is being called by an app, it should be added to /flow-typed/Lbry.js
const lbryProxy = new Proxy(Lbry, {
  get(target, name) {
    if (name in target) {
      return target[name];
    }

    return (params = {}) =>
      new Promise((resolve, reject) => {
        apiCall(name, params, resolve, reject);
      });
  },
});

module.exports = { lbryProxy, apiCall };
