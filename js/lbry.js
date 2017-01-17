import lighthouse from './lighthouse.js';

var lbry = {
  isConnected: false,
  rootPath: '.',
  daemonConnectionString: 'http://localhost:5279/lbryapi',
  webUiUri: 'http://localhost:5279',
  colors: {
    primary: '#155B4A'
  },
  defaultClientSettings: {
    showNsfw: false,
    debug: false,
    useCustomLighthouseServers: false,
    customLighthouseServers: [],
  }
};

lbry.jsonrpc_call = function (connectionString, method, params, callback, errorCallback, connectFailedCallback, timeout) {
  var xhr = new XMLHttpRequest;
  if (typeof connectFailedCallback !== 'undefined') {
    if (timeout) {
      xhr.timeout = timeout;
    }

    xhr.addEventListener('error', function (e) {
      connectFailedCallback(e);
    });
    xhr.addEventListener('timeout', function() {
      connectFailedCallback(new Error('XMLHttpRequest connection timed out'));
    })
  }
  xhr.addEventListener('load', function() {
    var response = JSON.parse(xhr.responseText);

    if (response.error) {
      if (errorCallback) {
        errorCallback(response.error);
      } else {
        var errorEvent = new CustomEvent('unhandledError', {
          detail: {
            connectionString: connectionString,
            method: method,
            params: params,
            code: response.error.code,
            message: response.error.message,
            data: response.error.data
          }
        });
        document.dispatchEvent(errorEvent)
      }
    } else if (callback) {
      callback(response.result);
    }
  });

  if (connectFailedCallback) {
    xhr.addEventListener('error', function (event) {
      connectFailedCallback(event);
    });
  } else {
    xhr.addEventListener('error', function (event) {
      var errorEvent = new CustomEvent('unhandledError', {
        detail: {
          connectionString: connectionString,
          method: method,
          params: params,
          code: xhr.status,
          message: 'Connection to API server failed'
        }
      });
      document.dispatchEvent(errorEvent);
    });
  }

  xhr.open('POST', connectionString, true);
  xhr.send(JSON.stringify({
    'jsonrpc': '2.0',
    'method': method,
    'params': params,
    'id': 0
  }));
}

lbry.call = function (method, params, callback, errorCallback, connectFailedCallback) {
  lbry.jsonrpc_call(lbry.daemonConnectionString, method, [params], callback, errorCallback, connectFailedCallback);
}


//core
lbry.connect = function(callback)
{
  // Check every half second to see if the daemon's running.
  // Returns true to callback once connected, or false if it takes too long and we give up.
  function checkDaemonRunning(tryNum=0) {
    lbry.daemonRunningStatus(function (runningStatus) {
      if (runningStatus) {
        lbry.isConnected = true;
        callback(true);
      } else {
        if (tryNum <= 600) { // Move # of tries into constant or config option
          setTimeout(function () {
            checkDaemonRunning(tryNum + 1);
          }, 500);
        } else {
          callback(false);
        }
      }
    });
  }
  checkDaemonRunning();
}

lbry.daemonRunningStatus = function (callback) {
  // Returns true/false whether the daemon is running (i.e. fully conncected to the network),
  // or null if the AJAX connection to the daemon fails.

  lbry.call('is_running', {}, callback, null, function () {
    callback(null);
  });
};

lbry.getDaemonStatus = function (callback) {
  lbry.call('daemon_status', {}, callback);
};

lbry.checkFirstRun = function(callback) {
  lbry.call('is_first_run', {}, callback);
}

lbry.getNewAddress = function(callback) {
  lbry.call('get_new_address', {}, callback);
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


lbry.getBalance = function(callback)
{
  lbry.call("get_balance", {}, callback);
}

lbry.sendToAddress = function(amount, address, callback, errorCallback)
{
  lbry.call("send_amount_to_address", { "amount" : amount, "address": address }, callback, errorCallback);
}

lbry.resolveName = function(name, callback) {
  lbry.call('resolve_name', { 'name': name }, callback, () => {
    // For now, assume any error means the name was not resolved
    callback(null);
  });
}

lbry.getStream = function(name, callback) {
  lbry.call('get', { 'name': name }, callback);
};

lbry.getClaimInfo = function(name, callback) {
  lbry.call('get_claim_info', { name: name }, callback);
}

lbry.getMyClaim = function(name, callback) {
  lbry.call('get_my_claim', { name: name }, callback);
}

lbry.getKeyFee = function(name, callback) {
  lbry.call('get_est_cost', { name: name }, callback);
}

lbry.getTotalCost = function(name, size, callback) {
  lbry.call('get_est_cost', {
    name: name,
    size: size,
  }, callback);
}

lbry.getPeersForBlobHash = function(blobHash, callback) {
  lbry.call('get_peers_for_hash', { blob_hash: blobHash }, callback)
}

lbry.getCostInfoForName = function(name, callback) {
  /**
   * Takes a LBRY name; will first try and calculate a total cost using
   * Lighthouse. If Lighthouse can't be reached, it just retrives the
   * key fee.
   *
   * Returns an object with members:
   *   - cost: Number; the calculated cost of the name
   *   - includes_data: Boolean; indicates whether or not the data fee info
   *     from Lighthouse is included.
   */
  function getCostWithData(name, size, callback) {
    lbry.getTotalCost(name, size, (cost) => {
      callback({
        cost: cost,
        includesData: true,
      });
    });
  }

  function getCostNoData(name, callback) {
    lbry.getKeyFee(name, (cost) => {
      callback({
        cost: cost,
        includesData: false,
      });
    });
  }

  lighthouse.getSizeForName(name, (size) => {
    getCostWithData(name, size, callback);
  }, () => {
    getCostNoData(name, callback);
  }, () => {
    getCostNoData(name, callback);
  });
}

lbry.getFileStatus = function(name, callback) {
  lbry.call('get_lbry_file', { 'name': name }, callback);
}

lbry.getFilesInfo = function(callback) {
  lbry.call('get_lbry_files', {}, callback);
}

lbry.getFileInfoByName = function(name, callback) {
  lbry.call('get_lbry_file', {name: name}, callback);
}

lbry.getFileInfoBySdHash = function(sdHash, callback) {
  lbry.call('get_lbry_file', {sd_hash: sdHash}, callback);
}

lbry.getFileInfoByFilename = function(filename, callback) {
  lbry.call('get_lbry_file', {file_name: filename}, callback);
}

lbry.getMyClaims = function(callback) {
  lbry.call('get_name_claims', {}, callback);
}

lbry.startFile = function(name, callback) {
  lbry.call('start_lbry_file', { name: name }, callback);
}

lbry.stopFile = function(name, callback) {
  lbry.call('stop_lbry_file', { name: name }, callback);
}

lbry.deleteFile = function(name, deleteTargetFile=true, callback) {
  lbry.call('delete_lbry_file', {
    name: name,
    delete_target_file: deleteTargetFile,
  }, callback);
}

lbry.revealFile = function(path, callback) {
  lbry.call('reveal', { path: path }, callback);
}

lbry.getFileInfoWhenListed = function(name, callback, timeoutCallback, tryNum=0) {
  // Calls callback with file info when it appears in the list of files returned by lbry.getFilesInfo().
  // If timeoutCallback is provided, it will be called if the file fails to appear.
  lbry.getFilesInfo(function(filesInfo) {
    for (var fileInfo of filesInfo) {
      if (fileInfo.lbry_uri == name) {
        callback(fileInfo);
        return;
      }
    }

    if (tryNum <= 200) {
      setTimeout(function() { lbry.getFileInfoWhenListed(name, callback, timeoutCallback, tryNum + 1) }, 250);
    } else if (timeoutCallback) {
      timeoutCallback();
    }
  });
}

lbry.publish = function(params, fileListedCallback, publishedCallback, errorCallback) {
  // Publishes a file.
  // The optional fileListedCallback is called when the file becomes available in
  // lbry.getFilesInfo() during the publish process.

  // Use ES6 named arguments instead of directly passing param dict?
  lbry.call('publish', params, publishedCallback, (errorInfo) => {
    errorCallback({
      name: fault.fault,
      message: fault.faultString,
    });
  });
  if (fileListedCallback) {
    lbry.getFileInfoWhenListed(params.name, function(fileInfo) {
      fileListedCallback(fileInfo);
    });
  }
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


export default lbry;
