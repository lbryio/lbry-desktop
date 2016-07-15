var lbry = {
  isConnected: false,
  rootPath: '.',
  colors: {
    primary: '#155B4A'
  }
};

lbry.call = function (method, params, callback, errorCallback, connectFailedCallback)
{
  var xhr = new XMLHttpRequest;
  xhr.addEventListener('load', function() {
    var response = JSON.parse(xhr.responseText);

    if (response.error) {
      if (errorCallback) {
        errorCallback(response.error);        
      }
    } else if (callback) {
      callback(response.result);       
    }
  });

  if (connectFailedCallback) {
    xhr.addEventListener('error', function (e) {
      connectFailedCallback(e);
    });
  }

  xhr.open('POST', 'http://localhost:5279/lbryapi', true);
  xhr.send(JSON.stringify({
    'jsonrpc': '2.0',
    'method': method,
    'params': [params, ],
    'id': 0
  }));    
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

lbry.getStartNotice = function(callback) {
  lbry.call('get_start_notice', {}, callback);
}

lbry.checkFirstRun = function(callback) {
  lbry.call('is_first_run', {}, callback);
}

lbry.getNewAddress = function(callback) {
  lbry.call('get_new_address', {}, callback);
}

lbry.getSettings = function(callback) {
  lbry.call('get_settings', {}, callback);
};

lbry.setSettings = function(settings, callback) {
  lbry.call('set_settings', settings, callback);
};

lbry.getBalance = function(callback)
{
  lbry.call("get_balance", {}, callback);
}

lbry.sendToAddress = function(amount, address, callback, errorCallback)
{
  lbry.call("send_amount_to_address", { "amount" : amount, "address": address }, callback, errorCallback);
}

lbry.search = function(query, callback)
{
  lbry.call("search_nametrie", { "search": query }, callback);
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

lbry.getCostEstimate = function(name, callback) {
  lbry.call('get_est_cost', { name: name }, callback);
}

lbry.getFileStatus = function(name, callback) {
  lbry.call('get_lbry_file', { 'name': name }, callback);
}

lbry.getFilesInfo = function(callback) {
  lbry.call('get_lbry_files', {}, callback);
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

lbry.publish = function(params, callback, errorCallback) {
  // Use ES6 named arguments instead of directly passing param dict?
  lbry.call('publish', params, callback, () => {
    // Change this to return error message or failure code
    callback(null);
  });
}

lbry.publish = function(params, callback) {
  // Use ES6 named arguments instead of directly passing param dict?
  lbry.call('publish', params, callback);
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

lbry.reportBug = function(message, callback) {
  lbry.call('upload_log', {
    name_prefix: 'report',
    exclude_previous: false,
    force: true,
    message: message
  }, callback);
}

//utilities
lbry.formatCredits = function(amount, precision)
{
  return amount.toFixed(precision || 1);
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
    newScript.onload = onload;
  }
  lbryScriptTag.parentNode.insertBefore(newScriptTag, lbryScriptTag);
}

lbry.imagePath = function(file)
{ 
  return lbry.rootPath + '/img/' + file; 
}

lbry.getMediaType = function(filename) {
  var dotIndex = filename.lastIndexOf('.');
  if (dotIndex == -1) {
    return 'unknown';
  }

  var ext = filename.substr(dotIndex + 1);
  if (/^mp4|mov|m4v|flv|f4v$/i.test(ext)) {
    return 'video';
  } else if (/^mp3|m4a|aac|wav|flac|ogg$/i.test(ext)) {
    return 'audio';
  } else if (/^html|htm|pdf|odf|doc|docx|md|markdown|txt$/i.test(ext)) {
    return 'document';
  } else {
    return 'unknown';
  }
}

lbry.stop = function(callback) {
  lbry.call('stop', {}, callback);
};


