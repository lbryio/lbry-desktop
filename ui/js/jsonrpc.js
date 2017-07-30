const jsonrpc = {};

jsonrpc.call = function(
  connectionString,
  method,
  params,
  callback,
  errorCallback,
  connectFailedCallback,
  timeout
) {
  var xhr = new XMLHttpRequest();
  if (typeof connectFailedCallback !== "undefined") {
    if (timeout) {
      xhr.timeout = timeout;
    }

    xhr.addEventListener("error", function(e) {
      connectFailedCallback(e);
    });
    xhr.addEventListener("timeout", function() {
      connectFailedCallback(
        new Error(__("XMLHttpRequest connection timed out"))
      );
    });
  }
  xhr.addEventListener("load", function() {
    var response = JSON.parse(xhr.responseText);

    let error = response.error || response.result && response.result.error;
    if (error) {
      if (errorCallback) {
        errorCallback(error);
      } else {
        var errorEvent = new CustomEvent("unhandledError", {
          detail: {
            connectionString: connectionString,
            method: method,
            params: params,
            code: error.code,
            message: error.message || error,
            data: error.data,
          },
        });
        document.dispatchEvent(errorEvent);
      }
    } else if (callback) {
      callback(response.result);
    }
  });

  if (connectFailedCallback) {
    xhr.addEventListener("error", function(event) {
      connectFailedCallback(event);
    });
  } else {
    xhr.addEventListener("error", function(event) {
      var errorEvent = new CustomEvent("unhandledError", {
        detail: {
          connectionString: connectionString,
          method: method,
          params: params,
          code: xhr.status,
          message: __("Connection to API server failed"),
        },
      });
      document.dispatchEvent(errorEvent);
    });
  }

  const counter = parseInt(sessionStorage.getItem("JSONRPCCounter") || 0);

  xhr.open("POST", connectionString, true);
  xhr.send(
    JSON.stringify({
      jsonrpc: "2.0",
      method: method,
      params: params,
      id: counter,
    })
  );

  sessionStorage.setItem("JSONRPCCounter", counter + 1);

  return xhr;
};

export default jsonrpc;
