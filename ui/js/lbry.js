import jsonrpc from "./jsonrpc.js";
import lbryuri from "./lbryuri.js";

function getLocal(key, fallback = undefined) {
  const itemRaw = localStorage.getItem(key);
  return itemRaw === null ? fallback : JSON.parse(itemRaw);
}

function setLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const { remote, ipcRenderer } = require("electron");
const menu = remote.require("./menu/main-menu");

let lbry = {
  isConnected: false,
  daemonConnectionString: "http://localhost:5279",
  pendingPublishTimeout: 20 * 60 * 1000,
};

function apiCall(method, params, resolve, reject) {
  return jsonrpc.call(
    lbry.daemonConnectionString,
    method,
    params,
    resolve,
    reject,
    reject
  );
}

/**
 * Records a publish attempt in local storage. Returns a dictionary with all the data needed to
 * needed to make a dummy claim or file info object.
 */
let pendingId = 0;
function savePendingPublish({ name, channel_name }) {
  let uri;
  if (channel_name) {
    uri = lbryuri.build({ name: channel_name, path: name }, false);
  } else {
    uri = lbryuri.build({ name: name }, false);
  }
  ++pendingId;
  const pendingPublishes = getLocal("pendingPublishes") || [];
  const newPendingPublish = {
    name,
    channel_name,
    claim_id: "pending-" + pendingId,
    txid: "pending-" + pendingId,
    nout: 0,
    outpoint: "pending-" + pendingId + ":0",
    time: Date.now(),
  };
  setLocal("pendingPublishes", [...pendingPublishes, newPendingPublish]);
  return newPendingPublish;
}

/**
 * If there is a pending publish with the given name or outpoint, remove it.
 * A channel name may also be provided along with name.
 */
function removePendingPublishIfNeeded({ name, channel_name, outpoint }) {
  function pubMatches(pub) {
    return (
      pub.outpoint === outpoint ||
      (pub.name === name &&
        (!channel_name || pub.channel_name === channel_name))
    );
  }

  setLocal(
    "pendingPublishes",
    lbry.getPendingPublishes().filter(pub => !pubMatches(pub))
  );
}

/**
 * Gets the current list of pending publish attempts. Filters out any that have timed out and
 * removes them from the list.
 */
lbry.getPendingPublishes = function() {
  const pendingPublishes = getLocal("pendingPublishes") || [];
  const newPendingPublishes = pendingPublishes.filter(
    pub => Date.now() - pub.time <= lbry.pendingPublishTimeout
  );
  setLocal("pendingPublishes", newPendingPublishes);
  return newPendingPublishes;
};

/**
 * Gets a pending publish attempt by its name or (fake) outpoint. A channel name can also be
 * provided along withe the name. If no pending publish is found, returns null.
 */
function getPendingPublish({ name, channel_name, outpoint }) {
  const pendingPublishes = lbry.getPendingPublishes();
  return (
    pendingPublishes.find(
      pub =>
        pub.outpoint === outpoint ||
        (pub.name === name &&
          (!channel_name || pub.channel_name === channel_name))
    ) || null
  );
}

function pendingPublishToDummyClaim({
  channel_name,
  name,
  outpoint,
  claim_id,
  txid,
  nout,
}) {
  return { name, outpoint, claim_id, txid, nout, channel_name };
}

function pendingPublishToDummyFileInfo({ name, outpoint, claim_id }) {
  return { name, outpoint, claim_id, metadata: null };
}

//core
lbry._connectPromise = null;
lbry.connect = function() {
  if (lbry._connectPromise === null) {
    lbry._connectPromise = new Promise((resolve, reject) => {
      let tryNum = 0;

      function checkDaemonStartedFailed() {
        if (tryNum <= 200) {
          // Move # of tries into constant or config option
          setTimeout(() => {
            tryNum++;
            checkDaemonStarted();
          }, tryNum < 50 ? 400 : 1000);
        } else {
          reject(new Error("Unable to connect to LBRY"));
        }
      }

      // Check every half second to see if the daemon is accepting connections
      function checkDaemonStarted() {
        lbry.status().then(resolve).catch(checkDaemonStartedFailed);
      }

      checkDaemonStarted();
    });
  }

  return lbry._connectPromise;
};

/**
 * Publishes a file. The optional fileListedCallback is called when the file becomes available in
 * lbry.file_list() during the publish process.
 *
 * This currently includes a work-around to cache the file in local storage so that the pending
 * publish can appear in the UI immediately.
 */
lbry.publishDeprecated = function(
  params,
  fileListedCallback,
  publishedCallback,
  errorCallback
) {
  lbry.publish(params).then(
    result => {
      if (returnPendingTimeout) clearTimeout(returnPendingTimeout);
      publishedCallback(result);
    },
    err => {
      if (returnPendingTimeout) clearTimeout(returnPendingTimeout);
      errorCallback(err);
    }
  );

  // Give a short grace period in case publish() returns right away or (more likely) gives an error
  const returnPendingTimeout = setTimeout(
    () => {
      if (publishedCallback) {
        savePendingPublish({
          name: params.name,
          channel_name: params.channel_name,
        });
        publishedCallback(true);
      }

      if (fileListedCallback) {
        const { name, channel_name } = params;
        savePendingPublish({
          name: params.name,
          channel_name: params.channel_name,
        });
        fileListedCallback(true);
      }
    },
    2000,
    { once: true }
  );
};

lbry.imagePath = function(file) {
  return "img/" + file;
};

lbry.getMediaType = function(contentType, fileName) {
  if (contentType) {
    return /^[^/]+/.exec(contentType)[0];
  } else if (fileName) {
    var dotIndex = fileName.lastIndexOf(".");
    if (dotIndex == -1) {
      return "unknown";
    }

    var ext = fileName.substr(dotIndex + 1);
    if (/^mp4|m4v|webm|flv|f4v|ogv$/i.test(ext)) {
      return "video";
    } else if (/^mp3|m4a|aac|wav|flac|ogg|opus$/i.test(ext)) {
      return "audio";
    } else if (
      /^html|htm|xml|pdf|odf|doc|docx|md|markdown|txt|epub|org$/i.test(ext)
    ) {
      return "document";
    } else {
      return "unknown";
    }
  } else {
    return "unknown";
  }
};

lbry.getAppVersionInfo = function() {
  return new Promise((resolve, reject) => {
    ipcRenderer.once("version-info-received", (event, versionInfo) => {
      resolve(versionInfo);
    });
    ipcRenderer.send("version-info-requested");
  });
};

/**
 * Wrappers for API methods to simulate missing or future behavior. Unlike the old-style stubs,
 * these are designed to be transparent wrappers around the corresponding API methods.
 */

/**
 * Returns results from the file_list API method, plus dummy entries for pending publishes.
 * (If a real publish with the same name is found, the pending publish will be ignored and removed.)
 */
lbry.file_list = function(params = {}) {
  return new Promise((resolve, reject) => {
    const { name, channel_name, outpoint } = params;

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
      "file_list",
      params,
      fileInfos => {
        removePendingPublishIfNeeded({ name, channel_name, outpoint });

        //if a naked file_list call, append the pending file infos
        if (!name && !channel_name && !outpoint) {
          const dummyFileInfos = lbry
            .getPendingPublishes()
            .map(pendingPublishToDummyFileInfo);

          resolve([...fileInfos, ...dummyFileInfos]);
        } else {
          resolve(fileInfos);
        }
      },
      reject
    );
  });
};

lbry.claim_list_mine = function(params = {}) {
  return new Promise((resolve, reject) => {
    apiCall(
      "claim_list_mine",
      params,
      claims => {
        for (let { name, channel_name, txid, nout } of claims) {
          removePendingPublishIfNeeded({
            name,
            channel_name,
            outpoint: txid + ":" + nout,
          });
        }

        const dummyClaims = lbry
          .getPendingPublishes()
          .map(pendingPublishToDummyClaim);
        resolve([...claims, ...dummyClaims]);
      },
      reject
    );
  });
};

lbry.resolve = function(params = {}) {
  return new Promise((resolve, reject) => {
    apiCall(
      "resolve",
      params,
      function(data) {
        if ("uri" in params) {
          // If only a single URI was requested, don't nest the results in an object
          resolve(data && data[params.uri] ? data[params.uri] : {});
        } else {
          resolve(data || {});
        }
      },
      reject
    );
  });
};

lbry = new Proxy(lbry, {
  get: function(target, name) {
    if (name in target) {
      return target[name];
    }

    return function(params = {}) {
      return new Promise((resolve, reject) => {
        apiCall(name, params, resolve, reject);
      });
    };
  },
});

export default lbry;
