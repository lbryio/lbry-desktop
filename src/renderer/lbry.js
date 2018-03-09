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

/**
 * Records a publish attempt in local storage. Returns a dictionary with all the data needed to
 * needed to make a dummy claim or file info object.
 */
let pendingId = 0;
function savePendingPublish({ name, channelName }) {
  pendingId += 1;
  const pendingPublishes = getLocal('pendingPublishes') || [];
  const newPendingPublish = {
    name,
    channelName,
    claim_id: `pending-${pendingId}`,
    txid: `pending-${pendingId}`,
    nout: 0,
    outpoint: `pending-${pendingId}:0`,
    time: Date.now(),
  };
  setLocal('pendingPublishes', [...pendingPublishes, newPendingPublish]);
  return newPendingPublish;
}

/**
 * If there is a pending publish with the given name or outpoint, remove it.
 * A channel name may also be provided along with name.
 */
function removePendingPublishIfNeeded({ name, channelName, outpoint }) {
  function pubMatches(pub) {
    return (
      pub.outpoint === outpoint ||
      (pub.name === name && (!channelName || pub.channel_name === channelName))
    );
  }

  setLocal('pendingPublishes', Lbry.getPendingPublishes().filter(pub => !pubMatches(pub)));
}

/**
 * Gets the current list of pending publish attempts. Filters out any that have timed out and
 * removes them from the list.
 */
Lbry.getPendingPublishes = () => {
  const pendingPublishes = getLocal('pendingPublishes') || [];
  const newPendingPublishes = pendingPublishes.filter(
    pub => Date.now() - pub.time <= Lbry.pendingPublishTimeout
  );
  setLocal('pendingPublishes', newPendingPublishes);
  return newPendingPublishes;
};

/**
 * Gets a pending publish attempt by its name or (fake) outpoint. A channel name can also be
 * provided along withe the name. If no pending publish is found, returns null.
 */
function getPendingPublish({ name, channelName, outpoint }) {
  const pendingPublishes = Lbry.getPendingPublishes();
  return (
    pendingPublishes.find(
      pub =>
        pub.outpoint === outpoint ||
        (pub.name === name && (!channelName || pub.channel_name === channelName))
    ) || null
  );
}

function pendingPublishToDummyClaim({ channelName, name, outpoint, claimId, txid, nout }) {
  return { name, outpoint, claimId, txid, nout, channelName };
}

function pendingPublishToDummyFileInfo({ name, outpoint, claimId }) {
  return { name, outpoint, claimId, metadata: null };
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

/**
 * Publishes a file. The optional fileListedCallback is called when the file becomes available in
 * lbry.file_list() during the publish process.
 *
 * This currently includes a work-around to cache the file in local storage so that the pending
 * publish can appear in the UI immediately.
 */
Lbry.publishDeprecated = (params, fileListedCallback, publishedCallback, errorCallback) => {
  // Give a short grace period in case publish() returns right away or (more likely) gives an error
  const returnPendingTimeout = setTimeout(
    () => {
      const { name, channel_name: channelName } = params;
      if (publishedCallback || fileListedCallback) {
        savePendingPublish({
          name,
          channelName,
        });
        publishedCallback(true);
      }
    },
    2000,
    { once: true }
  );

  lbryProxy.publish(params).then(
    result => {
      if (returnPendingTimeout) clearTimeout(returnPendingTimeout);
      publishedCallback(result);
    },
    err => {
      if (returnPendingTimeout) clearTimeout(returnPendingTimeout);
      errorCallback(err);
    }
  );
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

    /**
     * If we're searching by outpoint, check first to see if there's a matching pending publish.
     * Pending publishes use their own faux outpoints that are always unique, so we don't need
     * to check if there's a real file.
     */
    if (outpoint) {
      const pendingPublish = getPendingPublish({ outpoint });
      if (pendingPublish) {
        resolve([pendingPublishToDummyFileInfo(pendingPublish)]);
        return;
      }
    }

    apiCall(
      'file_list',
      params,
      fileInfos => {
        removePendingPublishIfNeeded({ name: claimName, channelName, outpoint });

        // if a naked file_list call, append the pending file infos
        if (!claimName && !channelName && !outpoint) {
          const dummyFileInfos = Lbry.getPendingPublishes().map(pendingPublishToDummyFileInfo);

          resolve([...fileInfos, ...dummyFileInfos]);
        } else {
          resolve(fileInfos);
        }
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
        claims.forEach(({ name, channel_name: channelName, txid, nout }) => {
          removePendingPublishIfNeeded({
            name,
            channelName,
            outpoint: `${txid}:${nout}`,
          });
        });

        const dummyClaims = Lbry.getPendingPublishes().map(pendingPublishToDummyClaim);
        resolve([...claims, ...dummyClaims]);
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
