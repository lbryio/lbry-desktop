// @flow
import { HEADERS } from 'lbry-redux';
// A modified version of Lbry.apiCall that allows
// to perform calling methods at arbitrary urls
// and pass form file fields
export default function apiPublishCallViaWeb(
  connectionString: string,
  token: string,
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

  function makeRequest(connectionString, method, token, body) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open(method, connectionString);
      xhr.setRequestHeader(HEADERS.AUTH_TOKEN, token);
      xhr.responseType = 'json';
      xhr.upload.onprogress = e => {
        let percentComplete = Math.ceil((e.loaded / e.total) * 100);
        console.log(percentComplete); // put your upload state update here
      };
      xhr.onload = () => {
        resolve(xhr);
      };
      xhr.onerror = () => {
        reject({ status: xhr.status, statusText: xhr.statusText });
      };
      xhr.send(body);
    });
  }

  return makeRequest(connectionString, 'POST', token, body)
    .then(xhr => {
      let error;
      if (xhr) {
        if (xhr.response && xhr.status >= 200 && xhr.status < 300) {
          return resolve(xhr.response.result);
        } else if (xhr.statusText) {
          error = new Error(xhr.statusText);
        } else {
          error = new Error('Upload likely timed out. Try a smaller file while we work on this.');
        }
      }

      if (error) {
        return Promise.reject(error);
      }
    })
    .catch(reject);
}
