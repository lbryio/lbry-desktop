// @flow
import { Lbry } from 'lbry-redux';

function checkAndParseFix(response) {
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

// A modified version of Lbry.apiCall that allows
// to perform calling methods at arbitrary urls
// and pass form file fields
function apiCallViaWeb(
  connectionString: string,
  method: string,
  params: { file_path: string },
  resolve: Function,
  reject: Function
) {
  const counter = new Date().getTime();
  const fileField = params.file_path;
  // Putting a dummy value here, the server is going to process the POSTed file
  // and set the file_path itself
  params.file_path = '__POST_FILE__';
  const jsonPayload = JSON.stringify({
    jsonrpc: '2.0',
    method,
    params,
    id: counter,
  });
  const body = new FormData();
  body.append('file', fileField);
  body.append('json_payload', jsonPayload);
  const options = {
    method: 'POST',
    body,
  };

  return fetch(connectionString, options)
    .then(checkAndParseFix)
    .then(response => {
      const error = response.error || (response.result && response.result.error);

      if (error) {
        return reject(error);
      }
      return resolve(response.result);
    })
    .catch(reject);
}

Lbry.setOverride(
  'publish',
  params =>
    new Promise((resolve, reject) => {
      apiCallViaWeb('/storage/content/', 'publish', params, resolve, reject);
    })
);
