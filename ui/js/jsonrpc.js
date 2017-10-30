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
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }

  function parseJSON(response) {
    return response.json();
  }

  function makeRequest(url, options) {
    return new Promise((resolve, reject) => {
      fetch(url, options).then(resolve).catch(reject);

      if (timeout) {
        const e = new Error(__("XMLHttpRequest connection timed out"));
        setTimeout(() => {
          return reject(e);
        }, timeout);
      }
    });
  }

  const counter = parseInt(sessionStorage.getItem("JSONRPCCounter") || 0);
  const url = connectionString;
  const options = {
    method: "POST",
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: method,
      params: params,
      id: counter,
    }),
  };

  sessionStorage.setItem("JSONRPCCounter", counter + 1);

  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(response => {
      const error =
        response.error || (response.result && response.result.error);

      if (!error && typeof callback === "function") {
        return callback(response.result);
      }

      if (error && typeof errorCallback === "function") {
        return errorCallback(error);
      }

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
    })
    .catch(e => {
      if (connectFailedCallback) {
        return connectFailedCallback(e);
      }

      var errorEvent = new CustomEvent("unhandledError", {
        detail: {
          connectionString: connectionString,
          method: method,
          params: params,
          code: e.response && e.response.status,
          message: __("Connection to API server failed"),
        },
      });
      document.dispatchEvent(errorEvent);
    });
};

export default jsonrpc;
