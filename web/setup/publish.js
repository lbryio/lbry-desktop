// @flow
import * as tus from 'tus-js-client';
import { v4 as uuid } from 'uuid';
import { makeUploadRequest } from './publish-v1';
import { makeResumableUploadRequest } from './publish-v2';
import { PUBLISH_TIMEOUT_BUT_LIKELY_SUCCESSFUL } from 'constants/errors';

// A modified version of Lbry.apiCall that allows
// to perform calling methods at arbitrary urls
// and pass form file fields
export default function apiPublishCallViaWeb(
  apiCall: (any, any, any, any) => any,
  token: string,
  method: string,
  params: FileUploadSdkParams,
  resolve: Function,
  reject: Function
) {
  const { file_path: filePath, preview, remote_url: remoteUrl } = params;
  const isMarkdown = filePath && typeof filePath === 'object' && filePath.type === 'text/markdown';

  if (!filePath && !remoteUrl) {
    const { claim_id: claimId, ...otherParams } = params;
    return apiCall(method, otherParams, resolve, reject);
  }

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
  }

  // Add a random ID to serve as the redux key.
  // If it already exists, then it is a resumed session.
  if (!params.guid) {
    params.guid = uuid();
  }

  const useV1 = remoteUrl || isMarkdown || preview || !tus.isSupported;

  // Note: both function signature (params) should match.
  const makeRequest = useV1 ? makeUploadRequest : makeResumableUploadRequest;

  return makeRequest(token, params, fileField, preview)
    .then((xhr) => {
      let error;
      if (xhr && xhr.response) {
        if (xhr.status >= 200 && xhr.status < 300 && !xhr.response.error) {
          return resolve(xhr.response.result);
        } else if (xhr.response.error) {
          if (xhr.responseURL.endsWith('/notify')) {
            // Temp handling until odysee-api/issues/401 is addressed.
            const errMsg = xhr.response.error.message;
            if (errMsg === 'file currently locked' || errMsg.endsWith('no such file or directory')) {
              return Promise.reject(new Error(PUBLISH_TIMEOUT_BUT_LIKELY_SUCCESSFUL));
            }
          }
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
