const jsonrpc = {};

jsonrpc.call = (
  connectionString,
  method,
  params,
  callback,
  errorCallback,
  connectFailedCallback
) => {
  function checkAndParse(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    }
    return response.json().then(json => {
      let error;
      if (json.error) {
        error = new Error(json.error);
      } else {
        error = new Error('Protocol error with unknown response signature');
      }
      return Promise.reject(error);
    });
  }

  const counter = parseInt(sessionStorage.getItem('JSONRPCCounter') || 0, 10);
  const url = connectionString;
  const options = {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
      id: counter,
    }),
  };

  sessionStorage.setItem('JSONRPCCounter', counter + 1);

  return fetch(url, options)
    .then(checkAndParse)
    .then(response => {
      const error = response.error || (response.result && response.result.error);

      if (!error && typeof callback === 'function') {
        return callback(response.result);
      }

      if (error && typeof errorCallback === 'function') {
        return errorCallback(error);
      }

      const errorEvent = new CustomEvent('unhandledError', {
        detail: {
          connectionString,
          method,
          params,
          code: error.code,
          message: error.message || error,
          data: error.data,
        },
      });
      document.dispatchEvent(errorEvent);

      return Promise.resolve();
    })
    .catch(error => {
      if (connectFailedCallback) {
        return connectFailedCallback(error);
      }

      const errorEvent = new CustomEvent('unhandledError', {
        detail: {
          connectionString,
          method,
          params,
          code: error.response && error.response.status,
          message: __('Connection to API server failed'),
        },
      });
      document.dispatchEvent(errorEvent);
      return Promise.resolve();
    });
};

export default jsonrpc;
