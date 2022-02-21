// @flow
import * as tus from 'tus-js-client';
import analytics from '../../ui/analytics';
import { X_LBRY_AUTH_TOKEN } from '../../ui/constants/token';
import { doUpdateUploadAdd, doUpdateUploadProgress, doUpdateUploadRemove } from '../../ui/redux/actions/publish';
import { LBRY_WEB_PUBLISH_API_V2 } from 'config';

const RESUMABLE_ENDPOINT = LBRY_WEB_PUBLISH_API_V2;
const RESUMABLE_ENDPOINT_METHOD = 'publish';
const UPLOAD_CHUNK_SIZE_BYTE = 10 * 1024 * 1024;

const STATUS_CONFLICT = 409;
const STATUS_LOCKED = 423;

/**
 * Checks whether a given status is in the range of the expected category.
 *
 * @param status
 * @param category
 * @returns {boolean}
 */
function inStatusCategory(status, category) {
  return status >= category && status < category + 100;
}

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

    const { uploadUrl, guid, ...sdkParams } = params;

    const jsonPayload = JSON.stringify({
      jsonrpc: '2.0',
      method: RESUMABLE_ENDPOINT_METHOD,
      params: sdkParams,
      id: new Date().getTime(),
    });

    const urlOptions = {};
    if (params.uploadUrl) {
      // Resuming from previous upload. TUS clears the resume fingerprint on any
      // 4xx error, so we need to use the fixed URL mode instead.
      urlOptions.uploadUrl = params.uploadUrl;
    } else {
      // New upload, so use `endpoint`.
      urlOptions.endpoint = RESUMABLE_ENDPOINT;
    }

    const uploader = new tus.Upload(file, {
      ...urlOptions,
      chunkSize: UPLOAD_CHUNK_SIZE_BYTE,
      retryDelays: [5000, 10000, 30000],
      parallelUploads: 1,
      storeFingerprintForResuming: false,
      removeFingerprintOnSuccess: true,
      headers: { [X_LBRY_AUTH_TOKEN]: token },
      metadata: {
        filename: file instanceof File ? file.name : file,
        filetype: file instanceof File ? file.type : undefined,
      },
      onShouldRetry: (err, retryAttempt, options) => {
        window.store.dispatch(doUpdateUploadProgress({ guid, status: 'retry' }));
        const status = err.originalResponse ? err.originalResponse.getStatus() : 0;
        return !inStatusCategory(status, 400) || status === STATUS_CONFLICT || status === STATUS_LOCKED;
      },
      onError: (err) => {
        const status = err.originalResponse ? err.originalResponse.getStatus() : 0;
        const errMsg = typeof err === 'string' ? err : err.message;

        let customErr;
        if (status === STATUS_LOCKED || errMsg === 'file currently locked') {
          customErr = 'File is locked. Try resuming after waiting a few minutes';
        }

        let localStorageInfo;
        if (errMsg.includes('QuotaExceededError')) {
          try {
            localStorageInfo = `${window.localStorage.length} items; ${
              JSON.stringify(window.localStorage).length
            } bytes`;
          } catch (e) {
            localStorageInfo = 'inaccessible';
          }
        }

        window.store.dispatch(doUpdateUploadProgress({ guid, status: 'error' }));

        analytics.sentryError(err, uploader);

        reject(
          // $FlowFixMe - flow's constructor for Error is incorrect.
          new Error(customErr || err, {
            cause: {
              url: uploader.url,
              status,
              ...(uploader._fingerprint ? { fingerprint: uploader._fingerprint } : {}),
              ...(uploader._retryAttempt ? { retryAttempt: uploader._retryAttempt } : {}),
              ...(uploader._offsetBeforeRetry ? { offsetBeforeRetry: uploader._offsetBeforeRetry } : {}),
              ...(customErr ? { original: errMsg } : {}),
              ...(localStorageInfo ? { localStorageInfo } : {}),
            },
          })
        );
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        window.store.dispatch(doUpdateUploadProgress({ guid, progress: percentage }));
      },
      onSuccess: () => {
        let retries = 1;

        function makeNotifyRequest() {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `${uploader.url}/notify`);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.setRequestHeader('Tus-Resumable', '1.0.0');
          xhr.setRequestHeader(X_LBRY_AUTH_TOKEN, token);
          xhr.responseType = 'json';
          xhr.onload = () => {
            window.store.dispatch(doUpdateUploadRemove(guid));
            resolve(xhr);
          };
          xhr.onerror = () => {
            if (retries > 0 && xhr.status === 0) {
              --retries;
              analytics.error('notify: first attempt failed (status=0). Retrying after 10s...');
              setTimeout(() => makeNotifyRequest(), 10000); // Auto-retry after 10s delay.
            } else {
              window.store.dispatch(doUpdateUploadProgress({ guid, status: 'error' }));
              reject(new Error(`There was a problem in the processing. Please retry. (${xhr.status})`));
            }
          };
          xhr.onabort = () => {
            window.store.dispatch(doUpdateUploadRemove(guid));
          };

          xhr.send(jsonPayload);
        }

        setTimeout(() => makeNotifyRequest(), 15000);
      },
    });

    uploader
      .findPreviousUploads()
      .then((previousUploads) => {
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
