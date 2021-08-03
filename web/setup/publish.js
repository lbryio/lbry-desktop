// @flow
/*
  https://api.lbry.tv/api/v1/proxy currently expects publish to consist
   of a multipart/form-data POST request with:
    - 'file' binary
    - 'json_payload' collection of publish params to be passed to the server's sdk.
 */
import { X_LBRY_AUTH_TOKEN } from '../../ui/constants/token';
import { doUpdateUploadProgress } from 'lbryinc';

// A modified version of Lbry.apiCall that allows
// to perform calling methods at arbitrary urls
// and pass form file fields
export default function apiPublishCallViaWeb(
  apiCall: (any, any, any, any) => any,
  connectionString: string,
  token: string,
  method: string,
  params: { file_path: string, preview: boolean, remote_url?: string }, // new param for remoteUrl
  resolve: Function,
  reject: Function
) {
  const { file_path: filePath, preview, remote_url: remoteUrl } = params;

  if (!filePath && !remoteUrl) {
    return apiCall(method, params, resolve, reject);
  }

  const counter = new Date().getTime();
  let fileField = filePath;

  if (preview) {
    // Send dummy file for the preview. The tx-fee calculation does not depend on it.
    const dummyContent = 'x';
    fileField = new File([dummyContent], 'dummy.md', { type: 'text/markdown' });
  }

  // Putting a dummy value here, the server is going to process the POSTed file
  // and set the file_path itself

  const body = new FormData();
  if (fileField) {
    body.append('file', fileField);
    params.file_path = '__POST_FILE__';
    delete params['remote_url'];
  } else if (remoteUrl) {
    body.append('remote_url', remoteUrl);
    delete params['remote_url'];
  }

  const jsonPayload = JSON.stringify({
    jsonrpc: '2.0',
    method,
    params,
    id: counter,
  });
  // no fileData? do the livestream remote publish
  body.append('json_payload', jsonPayload);

  function makeRequest(connectionString, method, token, body, params) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open(method, connectionString);
      xhr.setRequestHeader(X_LBRY_AUTH_TOKEN, token);
      xhr.responseType = 'json';
      xhr.upload.onprogress = (e) => {
        let percentComplete = Math.ceil((e.loaded / e.total) * 100);
        window.store.dispatch(doUpdateUploadProgress(percentComplete, params, xhr));
      };
      xhr.onload = () => {
        window.store.dispatch(doUpdateUploadProgress(undefined, params));
        resolve(xhr);
      };
      xhr.onerror = () => {
        window.store.dispatch(doUpdateUploadProgress(undefined, params));
        reject(new Error(__('There was a problem with your upload. Please try again.')));
      };

      xhr.onabort = () => {
        window.store.dispatch(doUpdateUploadProgress(undefined, params));
      };
      xhr.send(body);
    });
  }

  return makeRequest(connectionString, 'POST', token, body, params)
    .then((xhr) => {
      let error;
      if (xhr && xhr.response) {
        if (xhr.status >= 200 && xhr.status < 300 && !xhr.response.error) {
          return resolve(xhr.response.result);
        } else if (xhr.response.error) {
          error = new Error(xhr.response.error.message);
        } else {
          error = new Error(__('Upload likely timed out. Try a smaller file while we work on this.'));
        }
      }

      if (error) {
        return Promise.reject(error);
      }
    })
    .catch(reject);
}
