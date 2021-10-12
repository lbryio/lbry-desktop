// @flow
/*
  https://api.na-backend.odysee.com/api/v1/proxy currently expects publish to consist
   of a multipart/form-data POST request with:
    - 'file' binary
    - 'json_payload' collection of publish params to be passed to the server's sdk.

  v2 no longer uses 'multipart/form-data'. It uses TUS to support resummable upload.
 */
import * as tus from 'tus-js-client';
import { X_LBRY_AUTH_TOKEN } from '../../ui/constants/token';
import { doUpdateUploadAdd, doUpdateUploadProgress, doUpdateUploadRemove } from 'lbryinc';

const UPLOAD_CHUNK_SIZE_BYTE = 100000000;

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

  if (!tus.isSupported) {
    reject(new Error(__('Uploading is not supported with this browser.')));
    return;
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

  if (fileField) {
    params.file_path = '__POST_FILE__';
    delete params['remote_url'];
  } else if (remoteUrl) {
    delete params['remote_url'];
  }

  const jsonPayload = JSON.stringify({
    jsonrpc: '2.0',
    method,
    params,
    id: counter,
  });

  // no fileData? do the livestream remote publish

  function makeRequest(connectionString, token, params, file: File | string) {
    const metadata = {
      filename: file instanceof File ? file.name : file,
      filetype: file instanceof File ? file.type : undefined,
    };

    return new Promise((resolve, reject) => {
      const uploader = new tus.Upload(fileField, {
        endpoint: connectionString,
        chunkSize: UPLOAD_CHUNK_SIZE_BYTE,
        retryDelays: [0, 3000, 3000],
        parallelUploads: 1,
        removeFingerprintOnSuccess: true,
        headers: { [X_LBRY_AUTH_TOKEN]: token },
        metadata: metadata,
        onShouldRetry: (err, retryAttempt, options) => {
          window.store.dispatch(doUpdateUploadProgress({ params, status: 'retry' }));
          const FORBIDDEN_ERROR = 403;
          const status = err.originalResponse ? err.originalResponse.getStatus() : 0;
          return status !== FORBIDDEN_ERROR;
        },
        onError: (error) => {
          window.store.dispatch(doUpdateUploadProgress({ params, status: 'error' }));
          reject(new Error(error));
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          window.store.dispatch(doUpdateUploadProgress({ params, progress: percentage }));
        },
        onSuccess: () => {
          // Notify lbrynet server
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `${uploader.url}/notify`);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.setRequestHeader('Tus-Resumable', '1.0.0');
          xhr.setRequestHeader(X_LBRY_AUTH_TOKEN, token);
          xhr.responseType = 'json';
          xhr.onload = () => {
            window.store.dispatch(doUpdateUploadRemove(params));
            resolve(xhr);
          };
          xhr.onerror = () => {
            reject(new Error(__('There was a problem with your upload. Please try again.')));
          };
          xhr.onabort = () => {
            window.store.dispatch(doUpdateUploadRemove(params));
          };

          xhr.send(jsonPayload);
        },
      });

      uploader
        .findPreviousUploads()
        .then((previousUploads) => {
          if (previousUploads.length > 0) {
            uploader.resumeFromPreviousUpload(previousUploads[0]);
          }

          window.store.dispatch(doUpdateUploadAdd(fileField, params, uploader));
          uploader.start();
        })
        .catch((err) => {
          reject(new Error(__('Failed to initiate upload (%err%)', { err })));
        });
    });
  }

  return makeRequest(connectionString, token, params, fileField)
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
