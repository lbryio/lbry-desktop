import lbryio from "./lbryio.js";
import lighthouse from "./lighthouse.js";
import jsonrpc from "./jsonrpc.js";
import lbryuri from "./lbryuri.js";
import { getLocal, getSession, setSession, setLocal } from "./utils.js";

const { remote, ipcRenderer } = require("electron");
const menu = remote.require("./menu/main-menu");

let lbry = {
  isConnected: false,
  daemonConnectionString: "http://localhost:5279/lbryapi",
  pendingPublishTimeout: 20 * 60 * 1000,
  defaultClientSettings: {
    showNsfw: false,
    showUnavailable: true,
    debug: false,
    useCustomLighthouseServers: false,
    customLighthouseServers: [],
    showDeveloperMenu: false,
    language: "en",
  },
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
function savePendingPublish({ name, channel_name }) {
  let uri;
  if (channel_name) {
    uri = lbryuri.build({ name: channel_name, path: name }, false);
  } else {
    uri = lbryuri.build({ name: name }, false);
  }
  const pendingPublishes = getLocal("pendingPublishes") || [];
  const newPendingPublish = {
    name,
    channel_name,
    claim_id: "pending_claim_" + uri,
    txid: "pending_" + uri,
    nout: 0,
    outpoint: "pending_" + uri + ":0",
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
 * Takes a LBRY URI; will first try and calculate a total cost using
 * Lighthouse. If Lighthouse can't be reached, it just retrives the
 * key fee.
 *
 * Returns an object with members:
 *   - cost: Number; the calculated cost of the name
 *   - includes_data: Boolean; indicates whether or not the data fee info
 *     from Lighthouse is included.
 */
lbry.costPromiseCache = {};
lbry.getCostInfo = function(uri) {
  if (lbry.costPromiseCache[uri] === undefined) {
    lbry.costPromiseCache[uri] = new Promise((resolve, reject) => {
      const COST_INFO_CACHE_KEY = "cost_info_cache";
      let costInfoCache = getSession(COST_INFO_CACHE_KEY, {});

      function cacheAndResolve(cost, includesData) {
        costInfoCache[uri] = { cost, includesData };
        setSession(COST_INFO_CACHE_KEY, costInfoCache);
        resolve({ cost, includesData });
      }

      if (!uri) {
        return reject(new Error(`URI required.`));
      }

      if (costInfoCache[uri] && costInfoCache[uri].cost) {
        return resolve(costInfoCache[uri]);
      }

      function getCost(uri, size) {
        lbry
          .stream_cost_estimate({ uri, ...(size !== null ? { size } : {}) })
          .then(cost => {
            cacheAndResolve(cost, size !== null);
          }, reject);
      }

      const uriObj = lbryuri.parse(uri);
      const name = uriObj.path || uriObj.name;

      lighthouse.get_size_for_name(name).then(size => {
        if (size) {
          getCost(name, size);
        } else {
          getCost(name, null);
        }
      });
    });
  }
  return lbry.costPromiseCache[uri];
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
      if (returnedPending) {
        return;
      }

      clearTimeout(returnPendingTimeout);
      publishedCallback(result);
    },
    err => {
      if (returnedPending) {
        return;
      }

      clearTimeout(returnPendingTimeout);
      errorCallback(err);
    }
  );

  let returnedPending = false;
  // Give a short grace period in case publish() returns right away or (more likely) gives an error
  const returnPendingTimeout = setTimeout(() => {
    returnedPending = true;

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
  }, 2000);
};

lbry.getClientSettings = function() {
  var outSettings = {};
  for (let setting of Object.keys(lbry.defaultClientSettings)) {
    var localStorageVal = localStorage.getItem("setting_" + setting);
    outSettings[setting] = localStorageVal === null
      ? lbry.defaultClientSettings[setting]
      : JSON.parse(localStorageVal);
  }
  return outSettings;
};

lbry.getClientSetting = function(setting) {
  var localStorageVal = localStorage.getItem("setting_" + setting);
  if (setting == "showDeveloperMenu") {
    return true;
  }
  return localStorageVal === null
    ? lbry.defaultClientSettings[setting]
    : JSON.parse(localStorageVal);
};

lbry.setClientSettings = function(settings) {
  for (let setting of Object.keys(settings)) {
    lbry.setClientSetting(setting, settings[setting]);
  }
};

lbry.setClientSetting = function(setting, value) {
  return localStorage.setItem("setting_" + setting, JSON.stringify(value));
};

//utilities
lbry.formatCredits = function(amount, precision) {
  return amount.toFixed(precision || 1).replace(/\.?0+$/, "");
};

lbry.formatName = function(name) {
  // Converts LBRY name to standard format (all lower case, no special characters, spaces replaced by dashes)
  name = name.replace("/s+/g", "-");
  name = name.toLowerCase().replace(/[^a-z0-9\-]/g, "");
  return name;
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
    if (/^mp4|m4v|mov|webm|flv|f4v|ogv$/i.test(ext)) {
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

lbry._subscribeIdCount = 0;
lbry._balanceSubscribeCallbacks = {};
lbry._balanceSubscribeInterval = 5000;

lbry._balanceUpdateInterval = null;
lbry._updateBalanceSubscribers = function() {
  lbry.wallet_balance().then(function(balance) {
    for (let callback of Object.values(lbry._balanceSubscribeCallbacks)) {
      callback(balance);
    }
  });

  if (
    !lbry._balanceUpdateInterval &&
    Object.keys(lbry._balanceSubscribeCallbacks).length
  ) {
    lbry._balanceUpdateInterval = setInterval(() => {
      lbry._updateBalanceSubscribers();
    }, lbry._balanceSubscribeInterval);
  }
};

lbry.balanceSubscribe = function(callback) {
  const subscribeId = ++lbry._subscribeIdCount;
  lbry._balanceSubscribeCallbacks[subscribeId] = callback;
  lbry._updateBalanceSubscribers();
  return subscribeId;
};

lbry.balanceUnsubscribe = function(subscribeId) {
  delete lbry._balanceSubscribeCallbacks[subscribeId];
  if (
    lbry._balanceUpdateInterval &&
    !Object.keys(lbry._balanceSubscribeCallbacks).length
  ) {
    clearInterval(lbry._balanceUpdateInterval);
  }
};

lbry.showMenuIfNeeded = function() {
  const showingMenu = sessionStorage.getItem("menuShown") || null;
  const chosenMenu = lbry.getClientSetting("showDeveloperMenu")
    ? "developer"
    : "normal";
  if (chosenMenu != showingMenu) {
    menu.showMenubar(chosenMenu == "developer");
  }
  sessionStorage.setItem("menuShown", chosenMenu);
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

        const dummyFileInfos = lbry
          .getPendingPublishes()
          .map(pendingPublishToDummyFileInfo);
        resolve([...fileInfos, ...dummyFileInfos]);
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

lbry._resolveXhrs = {};
lbry.resolve = function(params = {}) {
  return new Promise((resolve, reject) => {
    if (!params.uri) {
      throw __("Resolve has hacked cache on top of it that requires a URI");
    }
    lbry._resolveXhrs[params.uri] = apiCall(
      "resolve",
      params,
      function(data) {
        resolve(data && data[params.uri] ? data[params.uri] : {});
      },
      reject
    );
  });
};

lbry.cancelResolve = function(params = {}) {
  const xhr = lbry._resolveXhrs[params.uri];
  if (xhr && xhr.readyState > 0 && xhr.readyState < 4) {
    xhr.abort();
  }
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
