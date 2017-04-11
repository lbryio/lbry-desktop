import lighthouse from './lighthouse.js';
import jsonrpc from './jsonrpc.js';
import uri from './uri.js';
import {getLocal, setLocal} from './utils.js';

const {remote} = require('electron');
const menu = remote.require('./menu/main-menu');

/**
 * Records a publish attempt in local storage. Returns a dictionary with all the data needed to
 * needed to make a dummy claim or file info object.
 */
function savePendingPublish(name) {
  const pendingPublishes = getLocal('pendingPublishes') || [];
  const newPendingPublish = {
    claim_id: 'pending_claim_' + name,
    txid: 'pending_' + name,
    nout: 0,
    outpoint: 'pending_' + name + ':0',
    name: name,
    time: Date.now(),
  };
  setLocal('pendingPublishes', [...pendingPublishes, newPendingPublish]);
  return newPendingPublish;
}

function removePendingPublish({name, outpoint}) {
  setLocal('pendingPublishes', getPendingPublishes().filter(
    (pub) => pub.name != name && pub.outpoint != outpoint
  ));
}

/**
 * Gets the current list of pending publish attempts. Filters out any that have timed out and
 * removes them from the list.
 */
function getPendingPublishes() {
  const pendingPublishes = getLocal('pendingPublishes') || [];

  const newPendingPublishes = [];
  for (let pendingPublish of pendingPublishes) {
    if (Date.now() - pendingPublish.time <= lbry.pendingPublishTimeout) {
      newPendingPublishes.push(pendingPublish);
    }
  }
  setLocal('pendingPublishes', newPendingPublishes);
  return newPendingPublishes
}

/**
 * Gets a pending publish attempt by its name or (fake) outpoint. If none is found (or one is found
 * but it has timed out), returns null.
 */
function getPendingPublish({name, outpoint}) {
  const pendingPublishes = getPendingPublishes();
  const pendingPublishIndex = pendingPublishes.findIndex(
    ({name: itemName, outpoint: itemOutpoint}) => itemName == name || itemOutpoint == outpoint
  );
  const pendingPublish = pendingPublishes[pendingPublishIndex];

  if (pendingPublishIndex == -1) {
    return null;
  } else if (Date.now() - pendingPublish.time > lbry.pendingPublishTimeout) {
    // Pending publish timed out, so remove it from the stored list and don't match

    const newPendingPublishes = pendingPublishes.slice();
    newPendingPublishes.splice(pendingPublishIndex, 1);
    setLocal('pendingPublishes', newPendingPublishes);
    return null;
  } else {
    return pendingPublish;
  }
}

function pendingPublishToDummyClaim({name, outpoint, claim_id, txid, nout}) {
  return {
    name: name,
    outpoint: outpoint,
    claim_id: claim_id,
    txid: txid,
    nout: nout,
  };
}

function pendingPublishToDummyFileInfo({name, outpoint, claim_id}) {
  return {
    name: name,
    outpoint: outpoint,
    claim_id: claim_id,
    metadata: "Attempting publication",
  };
}


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
  jsonrpc.call(lbry.daemonConnectionString, method, [params], callback, errorCallback, connectFailedCallback);
}


//core
lbry.connect = function(callback)
{
  // Check every half second to see if the daemon is accepting connections
  // Once this returns True, can call getDaemonStatus to see where
  // we are in the startup process
  function checkDaemonStarted(tryNum=0) {
    lbry.isDaemonAcceptingConnections(function (runningStatus) {
      if (runningStatus) {
        lbry.isConnected = true;
        callback(true);
      } else {
        if (tryNum <= 600) { // Move # of tries into constant or config option
          setTimeout(function () {
            checkDaemonStarted(tryNum + 1);
          }, 500);
        } else {
          callback(false);
        }
      }
    });
  }
  checkDaemonStarted();
}

lbry.isDaemonAcceptingConnections = function (callback) {
  // Returns true/false whether the daemon is at a point it will start returning status
  lbry.call('status', {}, () => callback(true), null, () => callback(false))
};

lbry.getDaemonStatus = function (callback) {
  lbry.call('daemon_status', {}, callback);
};

lbry.checkFirstRun = function(callback) {
  lbry.call('is_first_run', {}, callback);
}

lbry.getNewAddress = function(callback) {
  lbry.call('wallet_new_address', {}, callback);
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

lbry.resolveName = function(name, callback) {
  if (!name) {
    throw new Error(`Name required.`);
  }
  lbry.call('resolve_name', { 'name': name }, callback, () => {
    // For now, assume any error means the name was not resolved
    callback(null);
  });
}

lbry.getStream = function(name, callback) {
  if (!name) {
    throw new Error(`Name required.`);
  }
  lbry.call('get', { 'name': name }, callback);
};

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

lbry.getCostInfo = function(lbryUri, callback, errorCallback) {
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
  if (!name) {
    throw new Error(`Name required.`);
  }

  function getCostWithData(name, size, callback, errorCallback) {
    lbry.stream_cost_estimate({name, size}).then((cost) => {
      callback({
        cost: cost,
        includesData: true,
      });
    }, errorCallback);
  }

  function getCostNoData(name, callback, errorCallback) {
    lbry.stream_cost_estimate({name}).then((cost) => {
      callback({
        cost: cost,
        includesData: false,
      });
    }, errorCallback);
  }

  const uriObj = uri.parseLbryUri(lbryUri);
  const name = uriObj.path || uriObj.name;

  lighthouse.get_size_for_name(name).then((size) => {
    getCostWithData(name, size, callback, errorCallback);
  }, () => {
    getCostNoData(name, callback, errorCallback);
  });
}

lbry.getFeaturedDiscoverNames = function(callback) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest;
    xhr.open('GET', 'https://api.lbry.io/discover/list', true);
    xhr.onload = () => {
      if (xhr.status === 200) {
        var responseData = JSON.parse(xhr.responseText);
        if (responseData.data) //new signature, once api.lbry.io is updated
        {
          resolve(responseData.data);
        }
        else
        {
          resolve(responseData);
        }
      } else {
        reject(Error('Failed to fetch featured names.'));
      }
    };
    xhr.send();
  });
}

lbry.getMyClaims = function(callback) {
  lbry.call('get_name_claims', {}, callback);
}

lbry.removeFile = function(outpoint, deleteTargetFile=true, callback) {
  this._removedFiles.push(outpoint);
  this._updateFileInfoSubscribers(outpoint);

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
      savePendingPublish(params.name);
      publishedCallback(true);
    }

    if (fileListedCallback) {
      savePendingPublish(params.name);
      fileListedCallback(true);
    }
  }, 2000);

  //lbry.getFileInfoWhenListed(params.name, function(fileInfo) {
  //  fileListedCallback(fileInfo);
  //});
}

lbry.getVersionInfo = function(callback) {
  lbry.call('version', {}, callback);
};

lbry.checkNewVersionAvailable = function(callback) {
  lbry.call('version', {}, function(versionInfo) {
    var ver = versionInfo.lbrynet_version.split('.');

    var maj = parseInt(ver[0]),
        min = parseInt(ver[1]),
        patch = parseInt(ver[2]);

    var remoteVer = versionInfo.remote_lbrynet.split('.');
    var remoteMaj = parseInt(remoteVer[0]),
        remoteMin = parseInt(remoteVer[1]),
        remotePatch = parseInt(remoteVer[2]);

    if (maj < remoteMaj) {
      var newVersionAvailable = true;
    } else if (maj == remoteMaj) {
      if (min < remoteMin) {
        var newVersionAvailable = true;
      } else if (min == remoteMin) {
        var newVersionAvailable = (patch < remotePatch);
      } else {
        var newVersionAvailable = false;
      }
    } else {
      var newVersionAvailable = false;
    }
    callback(newVersionAvailable);
  }, function(err) {
    if (err.fault == 'NoSuchFunction') {
      // Really old daemon that can't report a version
      callback(true);
    }
  });
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
lbry._fileInfoSubscribeInterval = 5000;
lbry._balanceSubscribeCallbacks = {};
lbry._balanceSubscribeInterval = 5000;
lbry._removedFiles = [];
lbry._claimIdOwnershipCache = {};

lbry._updateClaimOwnershipCache = function(claimId) {
  lbry.getMyClaims((claimInfos) => {
    lbry._claimIdOwnershipCache[claimId] = !!claimInfos.reduce(function(match, claimInfo) {
      return match || claimInfo.claim_id == claimId;
    });
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

lbry._updateBalanceSubscribers = function() {
  lbry.get_balance().then(function(balance) {
    for (let callback of Object.values(lbry._balanceSubscribeCallbacks)) {
      callback(balance);
    }
  });

  if (Object.keys(lbry._balanceSubscribeCallbacks).length) {
    setTimeout(() => {
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
}

lbry.showMenuIfNeeded = function() {
  const showingMenu = sessionStorage.getItem('menuShown') || null;
  const chosenMenu = lbry.getClientSetting('showDeveloperMenu') ? 'developer' : 'normal';
  if (chosenMenu != showingMenu) {
    menu.showMenubar(chosenMenu == 'developer');
  }
  sessionStorage.setItem('menuShown', chosenMenu);
};

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
    const {name, outpoint} = params;

    /**
     * If we're searching by outpoint, check first to see if there's a matching pending publish.
     * Pending publishes use their own faux outpoints that are always unique, so we don't need
     * to check if there's a real file.
     */
    if (outpoint !== undefined) {
      const pendingPublish = getPendingPublish({outpoint});
      if (pendingPublish) {
        resolve([pendingPublishToDummyFileInfo(pendingPublish)]);
        return;
      }
    }

    lbry.call('file_list', params, (fileInfos) => {
      // Remove any pending publications that are now listed in the file manager

      const pendingPublishes = getPendingPublishes();
      for (let {name: itemName} of fileInfos) {
        if (pendingPublishes.find(() => name == itemName)) {
          removePendingPublish({name: name});
        }
      }
      const dummyFileInfos = getPendingPublishes().map(pendingPublishToDummyFileInfo);
      resolve([...fileInfos, ...dummyFileInfos]);
    }, reject, reject);
  });
}

lbry.claim_list_mine = function(params={}) {
  return new Promise((resolve, reject) => {
    lbry.call('claim_list_mine', params, (claims) => {
      // Filter out pending publishes when the name is already in the file manager
      const dummyClaims = getPendingPublishes().filter(
        (pub) => !claims.find(({name}) => name == pub.name)
      ).map(pendingPublishToDummyClaim);

      resolve([...claims, ...dummyClaims]);
    }, reject, reject);
  });
}

lbry = new Proxy(lbry, {
  get: function(target, name) {
    if (name in target) {
      return target[name];
    }

    return function(params={}) {
      return new Promise((resolve, reject) => {
        jsonrpc.call(lbry.daemonConnectionString, name, [params], resolve, reject, reject);
      });
    };
  }
});

export default lbry;
