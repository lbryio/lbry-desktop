// @flow
import * as tus from 'tus-js-client';
import { X_LBRY_AUTH_TOKEN } from '../../ui/constants/token';
import { doUpdateUploadAdd, doUpdateUploadProgress, doUpdateUploadRemove } from '../../ui/redux/actions/publish';
import { LBRY_WEB_PUBLISH_API_V2 } from 'config';

const RESUMABLE_ENDPOINT = LBRY_WEB_PUBLISH_API_V2;
const RESUMABLE_ENDPOINT_METHOD = 'publish';
const UPLOAD_CHUNK_SIZE_BYTE = 100000000;

export function makeResumableUploadRequest(
  token: string,
  params: FileUploadSdkParams,
  file: File | string,
  isPreview?: boolean
) {
  return new Promise<any>((resolve, reject) => {
    if (!RESUMABLE_ENDPOINT) {
      reject(new Error('Publish: endpoint undefined'));
    }

    if (params.remote_url) {
      reject(new Error('Publish: v2 does not support remote_url'));
    }

    const jsonPayload = JSON.stringify({
      jsonrpc: '2.0',
      method: RESUMABLE_ENDPOINT_METHOD,
      params,
      id: new Date().getTime(),
    });

    const uploader = new tus.Upload(file, {
      endpoint: RESUMABLE_ENDPOINT,
      chunkSize: UPLOAD_CHUNK_SIZE_BYTE,
      retryDelays: [0, 5000, 10000, 15000],
      parallelUploads: 1,
      removeFingerprintOnSuccess: true,
      headers: { [X_LBRY_AUTH_TOKEN]: token },
      metadata: {
        filename: file instanceof File ? file.name : file,
        filetype: file instanceof File ? file.type : undefined,
      },
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
        let retries = 2;

        function makeNotifyRequest() {
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
            if (--retries > 0) {
              // Auto-retry after 10s delay.
              setTimeout(() => makeNotifyRequest(), 10000);
            } else {
              window.store.dispatch(doUpdateUploadProgress({ params, status: 'error' }));
              reject(new Error(__('There was a problem in the processing. Please retry.')));
            }
          };
          xhr.onabort = () => {
            window.store.dispatch(doUpdateUploadRemove(params));
          };

          xhr.send(jsonPayload);
        }

        makeNotifyRequest();
      },
    });

    uploader
      .findPreviousUploads()
      .then((previousUploads) => {
        if (previousUploads.length > 0) {
          uploader.resumeFromPreviousUpload(previousUploads[0]);
        }

        if (!isPreview) {
          window.store.dispatch(doUpdateUploadAdd(file, params, uploader));
        }

        uploader.start();
      })
      .catch((err) => {
        reject(new Error(__('Failed to initiate upload (%err%)', { err })));
      });
  });
}
