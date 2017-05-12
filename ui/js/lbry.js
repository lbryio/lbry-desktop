import lbryio from './lbryio.js';
import lighthouse from './lighthouse.js';
import jsonrpc from './jsonrpc.js';
import lbryuri from './lbryuri.js';
import {getLocal, getSession, setSession, setLocal} from './utils.js';

const {remote, ipcRenderer} = require('electron');
const menu = remote.require('./menu/main-menu');

/**
 * Records a publish attempt in local storage. Returns a dictionary with all the data needed to
 * needed to make a dummy claim or file info object.
 */
function savePendingPublish({name, channel_name}) {
  let uri;
  if (channel_name) {
    uri = lbryuri.build({name: channel_name, path: name}, false);
  } else {
    uri = lbryuri.build({name: name}, false);
  }
  const pendingPublishes = getLocal('pendingPublishes') || [];
  const newPendingPublish = {
    name, channel_name,
    claim_id: 'pending_claim_' + uri,
    txid: 'pending_' + uri,
    nout: 0,
    outpoint: 'pending_' + uri + ':0',
    time: Date.now(),
  };
  setLocal('pendingPublishes', [...pendingPublishes, newPendingPublish]);
  return newPendingPublish;
}

/**
 * If there is a pending publish with the given name or outpoint, remove it.
 * A channel name may also be provided along with name.
 */
function removePendingPublishIfNeeded({name, channel_name, outpoint}) {
  function pubMatches(pub) {
    return pub.outpoint === outpoint || (pub.name === name && (!channel_name || pub.channel_name === channel_name));
  }

  setLocal('pendingPublishes', getPendingPublishes().filter(pub => !pubMatches(pub)));
}

/**
 * Gets the current list of pending publish attempts. Filters out any that have timed out and
 * removes them from the list.
 */
function getPendingPublishes() {
  const pendingPublishes = getLocal('pendingPublishes') || [];
  const newPendingPublishes = pendingPublishes.filter(pub => Date.now() - pub.time <= lbry.pendingPublishTimeout);
  setLocal('pendingPublishes', newPendingPublishes);
  return newPendingPublishes;
}

/**
 * Gets a pending publish attempt by its name or (fake) outpoint. A channel name can also be
 * provided along withe the name. If no pending publish is found, returns null.
 */
function getPendingPublish({name, channel_name, outpoint}) {
  const pendingPublishes = getPendingPublishes();
  return pendingPublishes.find(
    pub => pub.outpoint === outpoint || (pub.name === name && (!channel_name || pub.channel_name === channel_name))
  ) || null;
}

function pendingPublishToDummyClaim({channel_name, name, outpoint, claim_id, txid, nout}) {
  return {name, outpoint, claim_id, txid, nout, channel_name};
}

function pendingPublishToDummyFileInfo({name, outpoint, claim_id}) {
  return {name, outpoint, claim_id, metadata: null};
}
window.pptdfi = pendingPublishToDummyFileInfo;

let lbry = {
  isConnected: false,
  rootPath: '.',
  daemonConnectionString: 'http://localhost:5279/lbryapi',
  webUiUri: 'http://localhost:5279',
  peerListTimeout: 6000,
  pendingPublishTimeout: 20 * 60 * 1000,
  colors: {
    primary: '#155B4A'
  },
  defaultClientSettings: {
    showNsfw: false,
    showUnavailable: true,
    debug: false,
    useCustomLighthouseServers: false,
    customLighthouseServers: [],
    showDeveloperMenu: false,
  }
};

lbry.call = function (method, params, callback, errorCallback, connectFailedCallback) {
  jsonrpc.call(lbry.daemonConnectionString, method, params, callback, errorCallback, connectFailedCallback);
}

//core
lbry._connectPromise = null;
lbry.connect = function() {
  if (lbry._connectPromise === null) {

    lbry._connectPromise = new Promise((resolve, reject) => {

      // Check every half second to see if the daemon is accepting connections
      function checkDaemonStarted(tryNum = 0) {
        lbry.isDaemonAcceptingConnections(function (runningStatus) {
          if (runningStatus) {
            resolve(true);
          }
          else {
            if (tryNum <= 600) { // Move # of tries into constant or config option
              setTimeout(function () {
                checkDaemonStarted(tryNum + 1);
              }, tryNum < 100 ? 200 : 1000);
            }
            else {
              reject(new Error("Unable to connect to LBRY"));
            }
          }
        });
      }

      checkDaemonStarted();
    });
  }

  return lbry._connectPromise;
}


//kill this but still better than document.title =, which this replaced
lbry.setTitle = function(title) {
  document.title = title + " - LBRY";
}

//kill this with proper routing
lbry.back = function() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "?discover";
  }
}

lbry.isDaemonAcceptingConnections = function (callback) {
  // Returns true/false whether the daemon is at a point it will start returning status
  lbry.call('status', {}, () => callback(true), null, () => callback(false))
};

lbry.checkFirstRun = function(callback) {
  lbry.call('is_first_run', {}, callback);
}

lbry.getUnusedAddress = function(callback) {
  lbry.call('wallet_unused_address', {}, callback);
}

lbry.checkAddressIsMine = function(address, callback) {
  lbry.call('address_is_mine', {address: address}, callback);
}

lbry.getDaemonSettings = function(callback) {
  lbry.call('get_settings', {}, callback);
}

lbry.setDaemonSettings = function(settings, callback) {
  lbry.call('set_settings', settings, callback);
}

lbry.setDaemonSetting = function(setting, value, callback) {
  var setSettingsArgs = {};
  setSettingsArgs[setting] = value;
  lbry.call('set_settings', setSettingsArgs, callback)
}


lbry.getBalance = function(callback) {
  lbry.call("wallet_balance", {}, callback);
}

lbry.sendToAddress = function(amount, address, callback, errorCallback) {
  lbry.call("send_amount_to_address", { "amount" : amount, "address": address }, callback, errorCallback);
}

lbry.getClaimInfo = function(name, callback) {
  if (!name) {
    throw new Error(`Name required.`);
  }
  lbry.call('get_claim_info', { name: name }, callback);
}

lbry.getMyClaim = function(name, callback) {
  lbry.call('claim_list_mine', {}, (claims) => {
    callback(claims.find((claim) => claim.name == name) || null);
  });
}

lbry.getPeersForBlobHash = function(blobHash, callback) {
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    callback([]);
  }, lbry.peerListTimeout);

  lbry.call('peer_list', { blob_hash: blobHash }, function(peers) {
    if (!timedOut) {
      clearTimeout(timeout);
      callback(peers);
    }
  });
}

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
lbry.costPromiseCache = {}
lbry.getCostInfo = function(uri) {
  if (lbry.costPromiseCache[uri] === undefined) {
    lbry.costPromiseCache[uri] = new Promise((resolve, reject) => {
      const COST_INFO_CACHE_KEY = 'cost_info_cache';
      let costInfoCache = getSession(COST_INFO_CACHE_KEY, {})

      function cacheAndResolve(cost, includesData) {
        costInfoCache[uri] = {cost, includesData};
        setSession(COST_INFO_CACHE_KEY, costInfoCache);
        resolve({cost, includesData});
      }

      if (!uri) {
        return reject(new Error(`URI required.`));
      }

      if (costInfoCache[uri] && costInfoCache[uri].cost) {
        return resolve(costInfoCache[uri])
      }

      function getCost(uri, size) {
        lbry.stream_cost_estimate({uri, ... size !== null ? {size} : {}}).then((cost) => {
          cacheAndResolve(cost, size !== null);
        }, reject);
      }

      function getCostGenerous(uri) {
        // If generous is on, the calculation is simple enough that we might as well do it here in the front end
        lbry.resolve({uri: uri}).then((resolutionInfo) => {
          if (!resolutionInfo) {
            return reject(new Error("Unused URI"));
          }
          const fee = resolutionInfo.claim.value.stream.metadata.fee;
          if (fee === undefined) {
            cacheAndResolve(0, true);
          } else if (fee.currency == 'LBC') {
            cacheAndResolve(fee.amount, true);
          } else {
            lbryio.getExchangeRates().then(({lbc_usd}) => {
              cacheAndResolve(fee.amount / lbc_usd, true);
            });
          }
        });
      }

      const uriObj = lbryuri.parse(uri);
      const name = uriObj.path || uriObj.name;

      lbry.settings_get({allow_cached: true}).then(({is_generous_host}) => {
        if (is_generous_host) {
          return getCostGenerous(uri);
        }

        lighthouse.get_size_for_name(name).then((size) => {
          if (size) {
            getCost(name, size);
          }
          else {
            getCost(name, null);
          }
        }, () => {
          getCost(name, null);
        });
      });
    });
  }
  return lbry.costPromiseCache[uri];
}

lbry.getMyClaims = function(callback) {
  lbry.call('get_name_claims', {}, callback);
}

lbry.removeFile = function(outpoint, deleteTargetFile=true, callback) {
  this._removedFiles.push(outpoint);
  // this._updateFileInfoSubscribers(outpoint);

  lbry.file_delete({
    outpoint: outpoint,
    delete_target_file: deleteTargetFile,
  }).then(callback);
}

lbry.getFileInfoWhenListed = function(name, callback, timeoutCallback, tryNum=0) {
  function scheduleNextCheckOrTimeout() {
    if (timeoutCallback && tryNum > 200) {
      timeoutCallback();
    } else {
      setTimeout(() => lbry.getFileInfoWhenListed(name, callback, timeoutCallback, tryNum + 1), 250);
    }
  }

  // Calls callback with file info when it appears in the lbrynet file manager.
  // If timeoutCallback is provided, it will be called if the file fails to appear.
  lbry.file_list({name: name}).then(([fileInfo]) => {
    if (fileInfo) {
      callback(fileInfo);
    } else {
      scheduleNextCheckOrTimeout();
    }
  }, () => scheduleNextCheckOrTimeout());
}

/**
 * Publishes a file. The optional fileListedCallback is called when the file becomes available in
 * lbry.file_list() during the publish process.
 *
 * This currently includes a work-around to cache the file in local storage so that the pending
 * publish can appear in the UI immediately.
 */
lbry.publish = function(params, fileListedCallback, publishedCallback, errorCallback) {
  lbry.call('publish', params, (result) => {
    if (returnedPending) {
      return;
    }

    clearTimeout(returnPendingTimeout);
    publishedCallback(result);
  }, (err) => {
    if (returnedPending) {
      return;
    }

    clearTimeout(returnPendingTimeout);
    errorCallback(err);
  });

  let returnedPending = false;
  // Give a short grace period in case publish() returns right away or (more likely) gives an error
  const returnPendingTimeout = setTimeout(() => {
    returnedPending = true;

    if (publishedCallback) {
      savePendingPublish({name: params.name, channel_name: params.channel_name});
      publishedCallback(true);
    }

    if (fileListedCallback) {
      const {name, channel_name} = params;
      savePendingPublish({name: params.name, channel_name: params.channel_name});
      fileListedCallback(true);
    }
  }, 2000);

  //lbry.getFileInfoWhenListed(params.name, function(fileInfo) {
  //  fileListedCallback(fileInfo);
  //});
}


lbry.getClientSettings = function() {
  var outSettings = {};
  for (let setting of Object.keys(lbry.defaultClientSettings)) {
    var localStorageVal = localStorage.getItem('setting_' + setting);
    outSettings[setting] = (localStorageVal === null ? lbry.defaultClientSettings[setting] : JSON.parse(localStorageVal));
  }
  return outSettings;
}

lbry.getClientSetting = function(setting) {
  var localStorageVal = localStorage.getItem('setting_' + setting);
  if (setting == 'showDeveloperMenu')
  {
    return true;
  }
  return (localStorageVal === null ? lbry.defaultClientSettings[setting] : JSON.parse(localStorageVal));
}

lbry.setClientSettings = function(settings) {
  for (let setting of Object.keys(settings)) {
    lbry.setClientSetting(setting, settings[setting]);
  }
}

lbry.setClientSetting = function(setting, value) {
  return localStorage.setItem('setting_' + setting, JSON.stringify(value));
}

lbry.getSessionInfo = function(callback) {
  lbry.call('get_lbry_session_info', {}, callback);
}

lbry.reportBug = function(message, callback) {
  lbry.call('report_bug', {
    message: message
  }, callback);
}

//utilities
lbry.formatCredits = function(amount, precision)
{
  return amount.toFixed(precision || 1).replace(/\.?0+$/, '');
}

lbry.formatName = function(name) {
  // Converts LBRY name to standard format (all lower case, no special characters, spaces replaced by dashes)
  name = name.replace('/\s+/g', '-');
  name = name.toLowerCase().replace(/[^a-z0-9\-]/g, '');
  return name;
}

lbry.nameIsValid = function(name, checkCase=true) {
  const regexp = new RegExp('^[a-z0-9-]+$', checkCase ? '' : 'i');
  return regexp.test(name);
}

lbry.loadJs = function(src, type, onload)
{
  var lbryScriptTag = document.getElementById('lbry'),
      newScriptTag = document.createElement('script'),
      type = type || 'text/javascript';

  newScriptTag.src = src;
  newScriptTag.type = type;
  if (onload)
  {
    newScriptTag.onload = onload;
  }
  lbryScriptTag.parentNode.insertBefore(newScriptTag, lbryScriptTag);
}

lbry.imagePath = function(file)
{
  return lbry.rootPath + '/img/' + file;
}

lbry.getMediaType = function(contentType, fileName) {
  if (contentType) {
    return /^[^/]+/.exec(contentType);
  } else if (fileName) {
    var dotIndex = fileName.lastIndexOf('.');
    if (dotIndex == -1) {
      return 'unknown';
    }

    var ext = fileName.substr(dotIndex + 1);
    if (/^mp4|mov|m4v|flv|f4v$/i.test(ext)) {
      return 'video';
    } else if (/^mp3|m4a|aac|wav|flac|ogg$/i.test(ext)) {
      return 'audio';
    } else if (/^html|htm|pdf|odf|doc|docx|md|markdown|txt$/i.test(ext)) {
      return 'document';
    } else {
      return 'unknown';
    }
  } else {
    return 'unknown';
  }
}

lbry.stop = function(callback) {
  lbry.call('stop', {}, callback);
};

lbry.fileInfo = {};
lbry._subscribeIdCount = 0;
lbry._fileInfoSubscribeCallbacks = {};
lbry._fileInfoSubscribeInterval = 500000;
lbry._balanceSubscribeCallbacks = {};
lbry._balanceSubscribeInterval = 5000;
lbry._removedFiles = [];
lbry._claimIdOwnershipCache = {};

lbry._updateClaimOwnershipCache = function(claimId) {
  lbry.getMyClaims((claimInfos) => {
    lbry._claimIdOwnershipCache[claimId] = !!claimInfos.reduce(function(match, claimInfo) {
      return match || claimInfo.claim_id == claimId;
    }, false);
  });

};

lbry._updateFileInfoSubscribers = function(outpoint) {
  const callSubscribedCallbacks = (outpoint, fileInfo) => {
    for (let callback of Object.values(this._fileInfoSubscribeCallbacks[outpoint])) {
      callback(fileInfo);
    }
  }

  if (lbry._removedFiles.includes(outpoint)) {
    callSubscribedCallbacks(outpoint, false);
  } else {
    lbry.file_list({
      outpoint: outpoint,
      full_status: true,
    }).then(([fileInfo]) => {
      if (fileInfo) {
        if (this._claimIdOwnershipCache[fileInfo.claim_id] === undefined) {
          this._updateClaimOwnershipCache(fileInfo.claim_id);
        }
        fileInfo.isMine = !!this._claimIdOwnershipCache[fileInfo.claim_id];
      }

      callSubscribedCallbacks(outpoint, fileInfo);
    });
  }

  if (Object.keys(this._fileInfoSubscribeCallbacks[outpoint]).length) {
    setTimeout(() => {
      this._updateFileInfoSubscribers(outpoint);
    }, lbry._fileInfoSubscribeInterval);
  }
}

lbry.fileInfoSubscribe = function(outpoint, callback) {
  if (!lbry._fileInfoSubscribeCallbacks[outpoint])
  {
    lbry._fileInfoSubscribeCallbacks[outpoint] = {};
  }

  const subscribeId = ++lbry._subscribeIdCount;
  lbry._fileInfoSubscribeCallbacks[outpoint][subscribeId] = callback;
  lbry._updateFileInfoSubscribers(outpoint);
  return subscribeId;
}

lbry.fileInfoUnsubscribe = function(outpoint, subscribeId) {
  delete lbry._fileInfoSubscribeCallbacks[outpoint][subscribeId];
}

lbry._balanceUpdateInterval = null;
lbry._updateBalanceSubscribers = function() {
  lbry.get_balance().then(function(balance) {
    for (let callback of Object.values(lbry._balanceSubscribeCallbacks)) {
      callback(balance);
    }
  });

  if (!lbry._balanceUpdateInterval && Object.keys(lbry._balanceSubscribeCallbacks).length) {
    lbry._balanceUpdateInterval = setInterval(() => {
      lbry._updateBalanceSubscribers();
    }, lbry._balanceSubscribeInterval);
  }
}

lbry.balanceSubscribe = function(callback) {
  const subscribeId = ++lbry._subscribeIdCount;
  lbry._balanceSubscribeCallbacks[subscribeId] = callback;
  lbry._updateBalanceSubscribers();
  return subscribeId;
}

lbry.balanceUnsubscribe = function(subscribeId) {
  delete lbry._balanceSubscribeCallbacks[subscribeId];
  if (lbry._balanceUpdateInterval && !Object.keys(lbry._balanceSubscribeCallbacks).length) {
    clearInterval(lbry._balanceUpdateInterval)
  }
}

lbry.showMenuIfNeeded = function() {
  const showingMenu = sessionStorage.getItem('menuShown') || null;
  const chosenMenu = lbry.getClientSetting('showDeveloperMenu') ? 'developer' : 'normal';
  if (chosenMenu != showingMenu) {
    menu.showMenubar(chosenMenu == 'developer');
  }
  sessionStorage.setItem('menuShown', chosenMenu);
};

lbry.getVersionInfo = function() {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('version-info-received', (event, versionInfo) => { resolve(versionInfo) });
    ipcRenderer.send('version-info-requested');
  });
}


/**
 * Wrappers for API methods to simulate missing or future behavior. Unlike the old-style stubs,
 * these are designed to be transparent wrappers around the corresponding API methods.
 */

/**
 * Returns results from the file_list API method, plus dummy entries for pending publishes.
 * (If a real publish with the same name is found, the pending publish will be ignored and removed.)
 */
lbry.file_list = function(params={}) {
  return new Promise((resolve, reject) => {
    const {name, channel_name, outpoint} = params;

    /**
     * If we're searching by outpoint, check first to see if there's a matching pending publish.
     * Pending publishes use their own faux outpoints that are always unique, so we don't need
     * to check if there's a real file.
     */
    if (outpoint) {
      const pendingPublish = getPendingPublish({outpoint});
      if (pendingPublish) {
        resolve([pendingPublishToDummyFileInfo(pendingPublish)]);
        return;
      }
    }

    lbry.call('file_list', params, (fileInfos) => {
      removePendingPublishIfNeeded({name, channel_name, outpoint});

      const dummyFileInfos = getPendingPublishes().map(pendingPublishToDummyFileInfo);
      resolve([...fileInfos, ...dummyFileInfos]);
    }, reject, reject);
  });
}

lbry.claim_list_mine = function(params={}) {
  return new Promise((resolve, reject) => {
    lbry.call('claim_list_mine', params, (claims) => {
      for (let {name, channel_name, txid, nout} of claims) {
        removePendingPublishIfNeeded({name, channel_name, outpoint: txid + ':' + nout});
      }

      const dummyClaims = getPendingPublishes().map(pendingPublishToDummyClaim);
      resolve([...claims, ...dummyClaims]);
    }, reject, reject)
  });
}

const claimCacheKey = 'resolve_claim_cache';
lbry._claimCache = getSession(claimCacheKey, {});
lbry.resolve = function(params={}) {
  console.log('resolve: ' + params.uri);
  return new Promise((resolve, reject) => {
    if (!params.uri) {
      throw "Resolve has hacked cache on top of it that requires a URI"
    }
    if (params.uri && lbry._claimCache[params.uri] !== undefined) {
      resolve(lbry._claimCache[params.uri]);
    } else {
      lbry.call('resolve', params, function(data) {
        if (data !== undefined) {
          lbry._claimCache[params.uri] = data;
        }
        setSession(claimCacheKey, lbry._claimCache)
        resolve(data)
      }, reject)
    }
  });
}

// Adds caching.
lbry._settingsPromise = null;
lbry.settings_get = function(params={}) {
  if (params.allow_cached && lbry._settingsPromise) {
    return lbry._settingsPromise;
  }
  lbry._settingsPromise = new Promise((resolve, reject) => {
    lbry.call('settings_get', {}, (settings) => {
      setSession('settings', settings);
      resolve(settings);
    }, reject);
  });
  return lbry._settingsPromise;
}

// lbry.get = function(params={}) {
//   return function(params={}) {
//     return new Promise((resolve, reject) => {
//       jsonrpc.call(lbry.daemonConnectionString, "get", params, resolve, reject, reject);
//     });
//   };
// }

lbry = new Proxy(lbry, {
  get: function(target, name) {
    if (name in target) {
      return target[name];
    }

    return function(params={}) {
      return new Promise((resolve, reject) => {
        jsonrpc.call(lbry.daemonConnectionString, name, params, resolve, reject, reject);
      });
    };
  }
});

export default lbry;
