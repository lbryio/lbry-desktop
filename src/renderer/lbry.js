import { ipcRenderer } from 'electron';
import jsonrpc from 'jsonrpc';

const CHECK_DAEMON_STARTED_TRY_NUMBER = 200;

const Lbry = {
  isConnected: false,
  daemonConnectionString: 'http://localhost:5279',
  pendingPublishTimeout: 20 * 60 * 1000,
};

function apiCall(method, params, resolve, reject) {
  return jsonrpc.call(Lbry.daemonConnectionString, method, params, resolve, reject, reject);
}

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

function getLocal(key, fallback = undefined) {
  const itemRaw = localStorage.getItem(key);
  return itemRaw === null ? fallback : JSON.parse(itemRaw);
}

function setLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// core
Lbry.connectPromise = null;
Lbry.connect = () => {
  if (Lbry.connectPromise === null) {
    Lbry.connectPromise = new Promise((resolve, reject) => {
      let tryNum = 0;

      // Check every half second to see if the daemon is accepting connections
      function checkDaemonStarted() {
        tryNum += 1;
        lbryProxy
          .status()
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

  return Lbry.connectPromise;
};

Lbry.imagePath = file => `${staticResourcesPath}/img/${file}`;

Lbry.getMediaType = (contentType, fileName) => {
  if (contentType) {
    return /^[^/]+/.exec(contentType)[0];
  } else if (fileName) {
    const dotIndex = fileName.lastIndexOf('.');
    if (dotIndex === -1) {
      return 'unknown';
    }

    const ext = fileName.substr(dotIndex + 1);
    if (/^mp4|m4v|webm|flv|f4v|ogv$/i.test(ext)) {
      return 'video';
    } else if (/^mp3|m4a|aac|wav|flac|ogg|opus$/i.test(ext)) {
      return 'audio';
    } else if (/^html|htm|xml|pdf|odf|doc|docx|md|markdown|txt|epub|org$/i.test(ext)) {
      return 'document';
    }
    return 'unknown';
  }
  return 'unknown';
};

Lbry.getAppVersionInfo = () =>
  new Promise(resolve => {
    ipcRenderer.once('version-info-received', (event, versionInfo) => {
      resolve(versionInfo);
    });
    ipcRenderer.send('version-info-requested');
  });

/**
 * Wrappers for API methods to simulate missing or future behavior. Unlike the old-style stubs,
 * these are designed to be transparent wrappers around the corresponding API methods.
 */

/**
 * Returns results from the file_list API method, plus dummy entries for pending publishes.
 * (If a real publish with the same claim name is found, the pending publish will be ignored and removed.)
 */
Lbry.file_list = (params = {}) =>
  new Promise((resolve, reject) => {
    const { claim_name: claimName, channel_name: channelName, outpoint } = params;

    apiCall(
      'file_list',
      params,
      fileInfos => {
        resolve(fileInfos);
      },
      reject
    );
  });

Lbry.claim_list_mine = (params = {}) =>
  new Promise((resolve, reject) => {
    apiCall(
      'claim_list_mine',
      params,
      claims => {
        resolve(claims);
      },
      reject
    );
  });

Lbry.resolve = (params = {}) =>
  new Promise((resolve, reject) => {
    apiCall(
      'resolve',
      params,
      data => {
        if ('uri' in params) {
          // If only a single URI was requested, don't nest the results in an object
          resolve(data && data[params.uri] ? data[params.uri] : {});
        } else {
          resolve(data || {});
        }
      },
      reject
    );
  });

export default lbryProxy;
