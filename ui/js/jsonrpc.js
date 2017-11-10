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
  function checkAndParse(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    } else {
      return response.json().then(json => {
        let error;
        if (json.error) {
          error = new Error(json.error);
        } else {
          error = new Error("Protocol error with unknown response signature");
        }
        return Promise.reject(error);
      });
    }
  }

  function makeRequest(url, options) {
    return new Promise((resolve, reject) => {
      fetch(url, options).then(resolve).catch(reject);

      if (timeout) {
        const e = new Error(__("Protocol request timed out"));
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
    .then(checkAndParse)
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
