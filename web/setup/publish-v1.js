// @flow

// https://api.na-backend.odysee.com/api/v1/proxy currently expects publish to
// consist of a multipart/form-data POST request with:
//   - 'file' binary
//   - 'json_payload' publish params to be passed to the server's sdk.

import analytics from '../../ui/analytics';
import { PUBLISH_TIMEOUT_BUT_LIKELY_SUCCESSFUL } from '../../ui/constants/errors';
import { X_LBRY_AUTH_TOKEN } from '../../ui/constants/token';
import { doUpdateUploadAdd, doUpdateUploadProgress, doUpdateUploadRemove } from '../../ui/redux/actions/publish';
import { LBRY_WEB_PUBLISH_API } from 'config';

const ENDPOINT = LBRY_WEB_PUBLISH_API;
const ENDPOINT_METHOD = 'publish';

const PUBLISH_FETCH_TIMEOUT_MS = 60000;

export function makeUploadRequest(
  token: string,
  params: FileUploadSdkParams,
  file: File | string,
  isPreview?: boolean
) {
  const { remote_url: remoteUrl } = params;

  const body = new FormData();

  if (file) {
    body.append('file', file);
    delete params['remote_url'];
  } else if (remoteUrl) {
    body.append('remote_url', remoteUrl);
    delete params['remote_url'];
  }

  const { uploadUrl, guid, ...sdkParams } = params;

  const jsonPayload = JSON.stringify({
    jsonrpc: '2.0',
    method: ENDPOINT_METHOD,
    params: sdkParams,
    id: new Date().getTime(),
  });

  // no fileData? do the livestream remote publish
  body.append('json_payload', jsonPayload);

  return new Promise<any>((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', ENDPOINT);
    xhr.setRequestHeader(X_LBRY_AUTH_TOKEN, token);
    if (!remoteUrl) {
      xhr.timeout = PUBLISH_FETCH_TIMEOUT_MS;
    }
    xhr.responseType = 'json';
    xhr.upload.onprogress = (e) => {
      const percentage = ((e.loaded / e.total) * 100).toFixed(2);
      window.store.dispatch(doUpdateUploadProgress({ guid, progress: percentage }));
    };
    xhr.onload = () => {
      window.store.dispatch(doUpdateUploadRemove(guid));
      resolve(xhr);
    };
    xhr.onerror = () => {
      window.store.dispatch(doUpdateUploadProgress({ guid, status: 'error' }));
      reject(new Error(__('There was a problem with your upload. Please try again.')));
    };
    xhr.ontimeout = () => {
      analytics.error(`publish-v1: timed out after ${PUBLISH_FETCH_TIMEOUT_MS / 1000}s`);
      window.store.dispatch(doUpdateUploadProgress({ guid, status: 'error' }));
      reject(new Error(PUBLISH_TIMEOUT_BUT_LIKELY_SUCCESSFUL));
    };
    xhr.onabort = () => {
      window.store.dispatch(doUpdateUploadRemove(guid));
    };

    if (!isPreview) {
      window.store.dispatch(doUpdateUploadAdd(file, params, xhr));
    }

    xhr.send(body);
  });
}
