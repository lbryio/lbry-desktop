const jsonrpc = {};

jsonrpc.call = function (connectionString, method, params, callback, errorCallback, connectFailedCallback, timeout) {
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
};

export default jsonrpc;
