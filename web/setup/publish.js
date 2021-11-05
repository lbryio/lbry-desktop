// @flow
import * as tus from 'tus-js-client';
import { makeUploadRequest } from './publish-v1';
import { makeResumableUploadRequest } from './publish-v2';

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

  if (!filePath && !remoteUrl) {
    return apiCall(method, params, resolve, reject);
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

  const useV1 = remoteUrl || preview || !tus.isSupported;

  // Note: both function signature (params) should match.
  const makeRequest = useV1 ? makeUploadRequest : makeResumableUploadRequest;

  return makeRequest(token, params, fileField, preview)
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
